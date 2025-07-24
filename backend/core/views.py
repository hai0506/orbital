from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import *
from itertools import chain
from rest_framework.decorators import api_view
from rest_framework.views import APIView
import json
from django.shortcuts import get_object_or_404
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

class EditProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        # return User.objects.get(id=2).profile_user
        return self.request.user.profile_user
    
class ProfileListView(generics.ListAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Profile.objects.all().exclude(user__id=self.request.user.id)

class RetrieveProfileView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_field='user_id'

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
            valid = False
            for value in category_values:
                category = get_or_none(Category, value = value)
                if category:
                    filters |= Q(categories=category)
                    valid=True

            if valid: qs = qs.filter(filters).distinct()
            else: qs = qs.none()

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

    def perform_create(self, serializer):
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
        org = get_or_none(Organization, user=self.request.user)
        vendor = get_or_none(Vendor, user=self.request.user)
        if org:
            return JobOffer.objects.filter(listing__author=org)
        elif vendor:
            return JobOffer.objects.filter(vendor=vendor)
        else: 
            raise PermissionError('User cannot edit offer status')
        
    def update(self, request, *args, **kwargs):
        status_value = request.data.get('status')
        if status_value not in ['pending', 'approved', 'rejected','confirmed','cancelled']:
            return Response({'status': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)            
            
        if status_value == 'confirmed':
            vendor = get_or_none(Vendor, user=self.request.user)
            if not vendor: raise PermissionError('User cannot confirm offers.')

            if request.data.get('agreement') == 'false':
                return Response({'agreement': 'Please agree to the Terms and Conditions.'}, status=status.HTTP_400_BAD_REQUEST)
            
            instance = self.get_object()
            fundraiser,_ = Fundraiser.objects.get_or_create(listing=instance.listing)
            vendor_fundraiser = VendorFundraiser.objects.create(offer=instance,revenue=0,org_fundraiser=fundraiser)
            
            inv_data = request.data.get('inventory', None)       
            if inv_data:
                products = json.loads(inv_data) 
                for product in products:
                    Product.objects.create(name=product['Item'],quantity=product['Quantity'],price=product['Price'],remarks=product['Remarks'],vendor=vendor_fundraiser)
            
        return super().update(request, *args, **kwargs)


    lookup_field = 'offer_id' # to edit: go http://127.0.0.1:8000/core/edit-offer-status/<whatever offer id>/
    
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

    lookup_field = 'offer_id' # http://127.0.0.1:8000/core/delete-offer/<offer id>/

class FundraiserListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        org = get_or_none(Organization, user=self.request.user)
        vendor = get_or_none(Vendor, user=self.request.user)
        status = self.request.query_params.get('status')
        if org:
            qs = Fundraiser.objects.filter(listing__author=org).order_by('listing__start_date','listing__start_time')
            if status:
                qs = [f for f in qs if f.status == status]
            return Response(FundraiserSerializer(qs, many=True).data)
        elif vendor:
            qs = VendorFundraiser.objects.filter(offer__vendor=vendor).order_by('org_fundraiser__listing__start_date','org_fundraiser__listing__start_time')
            if status:
                qs = [f for f in qs if f.org_fundraiser.status == status]
            return Response(VendorFundraiserSerializer(qs, many=True).data)
        else: 
            raise PermissionError('User cannot view fundraisers.')
        
class RetrieveFundraiserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, fundraiser_id):
        org = get_or_none(Organization, user=self.request.user)
        vendor = get_or_none(Vendor, user=self.request.user)
        if org:
            fundraiser = get_object_or_404(Fundraiser, fundraiser_id=fundraiser_id, listing__author=org)
            return Response(FundraiserSerializer(fundraiser).data)
        elif vendor:
            fundraiser = get_object_or_404(VendorFundraiser, fundraiser_id=fundraiser_id, offer__vendor=vendor)
            return Response(VendorFundraiserSerializer(fundraiser).data)
        else: 
            raise PermissionError('User cannot view fundraisers.')
        
class CreateProductView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        vendor = get_or_none(Vendor, user=self.request.user)
        if vendor:
            return Product.filter(vendor=vendor)
        else: return Product.objects.none()
        # return JobPost.objects.none()
    
    def perform_create(self, serializer):
        # vendor = Vendor.objects.get(user_id=2)
        # serializer.save(vendor=vendor)

        vendor = get_or_none(Vendor, user=self.request.user)
        if vendor:
            serializer.save(vendor=vendor)
        else:
            raise PermissionError('User cannot create products')
        
class ProductEditView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        vendor = get_or_none(Vendor, user=self.request.user)
        if vendor:
            return Product.filter(vendor=vendor)
        else: 
            raise PermissionError('User cannot edit products')
        # return Product.objects.all()

    lookup_field = 'product_id' # to edit: go http://127.0.0.1:8000/core/edit-product/<whatever product id>/

class UpdateInventoryView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, fundraiser_id):
        vendor = get_or_none(Vendor, user=self.request.user)
        if not vendor:
            raise PermissionError('User cannot edit inventory.')
        vendor_fundraiser = get_object_or_404(VendorFundraiser, fundraiser_id=fundraiser_id)
        if self.request.user != vendor_fundraiser.offer.vendor.user:
            raise PermissionError('User cannot edit this fundraiser\'s inventory.')
        
        inv_data = request.data.get('inventory', None)
        if inv_data:
            products = json.loads(inv_data)
            Product.objects.filter(vendor=vendor_fundraiser).delete()
            for product in products:
                Product.objects.create(name=product['Item'],quantity=product['Quantity'],price=product['Price'],remarks=product['Remarks'],vendor=vendor_fundraiser)
            return Response({'inventory_update':'Update successful.'}, status=status.HTTP_200_OK)
        return Response({'inventory_update': 'No inventory provided.'}, status=status.HTTP_400_BAD_REQUEST)

class CreateTransactionView(generics.CreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        vendor = get_or_none(Vendor, user=self.request.user)
        if vendor:
            vendor_fundraiser_id = self.kwargs.get('vendor_fundraiser_id')
            vendor_fundraiser = get_object_or_404(VendorFundraiser, fundraiser_id=vendor_fundraiser_id)
            serializer.save(vendor=vendor_fundraiser)
        else:
            raise PermissionError('User cannot make transactions.')

class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): 
        vendor = get_or_none(Vendor, user=self.request.user)
        if vendor:
            vendor_fundraiser_id = self.kwargs.get('vendor_fundraiser_id')
            vendor_fundraiser = get_object_or_404(VendorFundraiser, fundraiser_id=vendor_fundraiser_id)
            return Transaction.objects.filter(vendor=vendor_fundraiser)
        else: return Transaction.objects.none()
        
class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self): 
        receiver = self.kwargs['id']
        return Message.objects.filter(
            sender__in=[self.request.user, receiver],
            receiver__in=[self.request.user, receiver]
        ).order_by('time_created')
    
class ChatListView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user=User.objects.get(id=request.user.id)
        messages = Message.objects.filter(Q(sender=user) | Q(receiver=user)).order_by('time_created')

        receivers = set()
        for msg in messages:
            receiver = msg.receiver if msg.sender == user else msg.sender
            receivers.add(receiver)

        chats = []
        for receiver in receivers:
            msgs = Message.objects.filter(
                sender__in=[user, receiver],
                receiver__in=[user, receiver]
            ).order_by('time_created')

            chats.append({
                'chat_history': msgs,
                'me': user,
                'other': receiver,
            })

        return Response(ChatSerializer(chats, many=True).data)

    

