from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import *
from itertools import chain
from rest_framework.decorators import api_view
from rest_framework.views import APIView


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
        keyword_values = self.request.query_params.getlist('categories')

        # filter categories
        combined_queryset = None
        if len(keyword_values) > 0:
            for value in keyword_values:
                keyword = get_or_none(Category, value = value)
                if keyword:
                    if combined_queryset is None: combined_queryset = keyword.jobpost_set.all()
                    else: combined_queryset = combined_queryset.union(keyword.jobpost_set.all())
        else: 
            combined_queryset = JobPost.objects.all()

        # hide posts that the vendor has already made offers for
        vendor = get_or_none(Vendor, user=self.request.user)
        # vendor = Vendor.objects.get(user_id=2)
        if not vendor:
            return combined_queryset
        offered_posts = JobPost.objects.filter(post_offers__vendor=vendor)
        final_qs = combined_queryset.exclude(post_id__in=offered_posts.values_list('post_id', flat=True))

        # sort posts
        if sort_field == 'start_date':
            final_qs = final_qs.order_by(sort_field, 'start_time')
        elif sort_field == 'time_created':
            final_qs = final_qs.order_by(sort_field)
        return final_qs

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
        if org:
            return JobOffer.objects.filter(listing__author=org, status='pending')
        elif vendor:
            return JobOffer.objects.filter(vendor=vendor).exclude(status='confirmed')
        else: return JobOffer.objects.none()

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
            return Response(FundraiserSerializer(Fundraiser.objects.filter(listing__author=org), many=True).data)
        elif vendor:
            fundraisers = Fundraiser.objects.filter(vendors__vendor=vendor)
            return Response(JobOfferSerializer(JobOffer.objects.filter(vendor=vendor, fundraisers__in=fundraisers).distinct(),many=True).data)
        else: 
            raise PermissionError('User cannot view fundraisers.')