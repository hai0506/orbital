from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import *
from itertools import chain
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from django.db.models import F,Q


@api_view(['GET'])
def get_user_profile(request):
    user = request.user
    role = None

    if hasattr(user, 'organization_user'):
        role = 'organization'
    elif hasattr(user, 'vendor_user'):
        role = 'vendor'

    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': role,
    })

def get_or_none(classmodel, **kwargs):
    try:
        return classmodel.objects.get(**kwargs)
    except:
        return None

class CreateUserView(generics.CreateAPIView): # register
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class CreatePostView(generics.ListCreateAPIView): # create and view own posts
    serializer_class = JobPostSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        author = get_or_none(Organization, user=self.request.user)
        if author:
            return JobPost.filter(author=author)
        else: return JobPost.objects.none()
        # return JobPost.objects.none()

    def perform_create(self, serializer):
        # student = Organization.objects.get(user_id=1)
        # serializer.save(author=student)

        author = get_or_none(Organization, user=self.request.user)
        if author:
            serializer.save(author=author)
        else:
            raise PermissionError('User cannot create posts')

class PostListView(generics.ListAPIView): # view others posts and filters.
    serializer_class = JobPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):# to filter: http://127.0.0.1:8000/core/posts/?categories=whatever1&categories=whatever2&sortby=time_created&...
        sort_field = self.request.query_params.get('sortby')
        category_values = self.request.query_params.getlist('categories')

        # filter categories
        qs = JobPost.objects.all()
        if len(category_values) > 0:
            filters = Q()
            for value in category_values:
                category = get_or_none(Category, value = value)
                if category:
                    filters |= Q(categories=category)

            qs = qs.filter(filters).distinct()

        # hide posts that the vendor has already made offers for
        vendor = get_or_none(Vendor, user=self.request.user)
        # vendor = Vendor.objects.get(user_id=2)
        if not vendor:
            return qs
        offered_posts = JobPost.objects.filter(post_offers__vendor=vendor)
        final_qs = qs.exclude(post_id__in=offered_posts.values_list('post_id', flat=True))

        # sort posts
        if sort_field == 'start_date':
            final_qs = final_qs.order_by(sort_field, 'start_time')
        else:
            final_qs = final_qs.order_by('-time_created')
        return final_qs
    
class DeletePostView(generics.RetrieveDestroyAPIView):
    serializer_class = JobPostSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self): 
        org = get_or_none(Organization, user=self.request.user)
        if org:
            return JobPost.objects.filter(author=org)
        else: 
            raise PermissionError('User cannot delete offers.')

    lookup_field = 'post_id' # http://127.0.0.1:8000/core/delete-post/<post id>/

class CreateOfferView(generics.CreateAPIView): # create offers
    serializer_class = JobOfferSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        vendor = get_or_none(Vendor, user=self.request.user)
        if vendor:
            return JobOffer.filter(vendor=vendor)
        else: return JobOffer.objects.none()
        # return JobOffer.objects.none()

    def perform_create(self, serializer):
        # vendor = Vendor.objects.get(user_id=2)
        # serializer.save(vendor=vendor)

        vendor = get_or_none(Vendor, user=self.request.user)
        if vendor:
            serializer.save(vendor=vendor)
        else:
            raise PermissionError('User cannot create offers')
        
class OfferListView(generics.ListAPIView):
    serializer_class = JobOfferSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): 
        org = get_or_none(Organization, user=self.request.user)
        vendor = get_or_none(Vendor, user=self.request.user)
        sort_field = self.request.query_params.get('sortby')
        available = self.request.query_params.get('available')
        commission = self.request.query_params.get('commission')
        status = self.request.query_params.get('status')
        if org:
            qs = JobOffer.objects.filter(listing__author=org, status='pending')
            # available all only
            if available == '1':
                qs = qs.filter(allDays=True)
            # same or higher commision only
            if commission == '1':
                qs = qs.annotate(required_commission=F('listing__commission')).filter(
                    commission__gte=F('required_commission')
                )
        elif vendor:
            qs = JobOffer.objects.filter(vendor=vendor).exclude(status='confirmed')
            if status in ['approved','pending','rejected','cancelled']: qs = qs.filter(status=status)
        else: qs = JobOffer.objects.none()

        # sort
        if sort_field == 'start_date':
            qs = qs.order_by('listing__start_date', 'listing__start_time')
        else:
            qs = qs.order_by('-time_created')
        return qs

class UpdateOfferStatusView(generics.RetrieveUpdateAPIView):
    serializer_class = OfferStatusSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self): 
        # return JobOffer.objects.all()
        org = get_or_none(Organization, user=self.request.user)
        vendor = get_or_none(Vendor, user=self.request.user)
        if org:
            return JobOffer.objects.filter(listing__author=org)
        elif vendor:
            return JobOffer.objects.filter(vendor=vendor)
        else: 
            raise PermissionError('User cannot edit offer status')
        
    def update(self, request, *args, **kwargs):
        if request.data.get('status') == 'confirmed':
            instance = self.get_object()
            fundraiser,_ = Fundraiser.objects.get_or_create(listing=instance.listing)
            fundraiser.vendors.add(instance)

        return super().update(request, *args, **kwargs)


    lookup_field = 'offer_id' # to edit: go http://127.0.0.1:8000/core/edit-offer-status/<whatever product id>/
    
class DeleteOfferView(generics.RetrieveDestroyAPIView):
    serializer_class = JobOfferSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self): 
        org = get_or_none(Organization, user=self.request.user)
        vendor = get_or_none(Vendor, user=self.request.user)
        if org:
            return JobOffer.objects.filter(listing__author=org)
        elif vendor:
            return JobOffer.objects.filter(vendor=vendor)
        else: 
            raise PermissionError('User cannot delete offers.')

    lookup_field = 'offer_id' # http://127.0.0.1:8000/core/delete-offer/<product id>/

class FundraiserListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        org = get_or_none(Organization, user=self.request.user)
        vendor = get_or_none(Vendor, user=self.request.user)
        if org:
            return Response(FundraiserSerializer(Fundraiser.objects.filter(listing__author=org)
                    .order_by('listing__start_date','listing__start_time'), many=True).data)
        elif vendor:
            fundraisers = Fundraiser.objects.filter(vendors__vendor=vendor)
            return Response(JobOfferSerializer(JobOffer.objects.filter(vendor=vendor, fundraisers__in=fundraisers).distinct()
                .order_by('listing__start_date','listing__start_time'),many=True).data)
        else: 
            raise PermissionError('User cannot view fundraisers.')