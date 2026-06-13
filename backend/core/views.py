from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import *
from itertools import chain
from rest_framework.decorators import api_view
import json
from django.shortcuts import get_object_or_404
from django.db.models import F, Q
from datetime import datetime

User = get_user_model()


@api_view(['GET'])
def get_user_profile(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
    })


def get_or_none(classmodel, **kwargs):
    try:
        return classmodel.objects.get(**kwargs)
    except:
        return None


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class EditProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ProfileListView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.all().exclude(id=self.request.user.id)


class RetrieveProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    lookup_url_kwarg = 'user_id'


def UpdatePostIsClosed():
    for post in JobPost.objects.filter(is_closed=False):
        end_dt = datetime.combine(post.end_date, post.end_time)
        if datetime.now() > end_dt:
            post.is_closed = True
            post.save(update_fields=['is_closed'])


class CreatePostView(generics.ListCreateAPIView):
    serializer_class = JobPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'organization':
            UpdatePostIsClosed()
            return JobPost.objects.filter(author=self.request.user, is_closed=False)
        return JobPost.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role == 'organization':
            serializer.save(author=self.request.user)
        else:
            raise PermissionError('User cannot create posts')


class PostListView(generics.ListAPIView):
    serializer_class = JobPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        sort_field = self.request.query_params.get('sortby')
        category_values = self.request.query_params.getlist('categories')

        UpdatePostIsClosed()
        qs = JobPost.objects.filter(is_closed=False)

        if category_values:
            filters = Q()
            valid = False
            for value in category_values:
                category = get_or_none(Category, value=value)
                if category:
                    filters |= Q(categories=category)
                    valid = True
            if valid:
                qs = qs.filter(filters).distinct()
            else:
                qs = qs.none()

        if sort_field == 'start_date':
            qs = qs.order_by(sort_field, 'start_time')
        else:
            qs = qs.order_by('-time_created')

        if self.request.user.role == 'vendor':
            offered_posts = JobPost.objects.filter(post_offers__vendor=self.request.user)
            qs = qs.exclude(post_id__in=offered_posts.values_list('post_id', flat=True))

        return qs


class DeletePostView(generics.RetrieveDestroyAPIView):
    serializer_class = JobPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'organization':
            return JobPost.objects.filter(author=self.request.user)
        raise PermissionError('User cannot delete posts.')

    lookup_field = 'post_id'


class ClosePostView(generics.UpdateAPIView):
    serializer_class = ClosePostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != 'organization':
            raise PermissionError('User cannot close posts.')
        return JobPost.objects.filter(author=self.request.user)

    lookup_field = 'post_id'


class CreateOfferView(generics.CreateAPIView):
    serializer_class = JobOfferSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role == 'vendor':
            serializer.save(vendor=self.request.user)
        else:
            raise PermissionError('User cannot create offers')


class OfferListView(generics.ListAPIView):
    serializer_class = JobOfferSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        sort_field = self.request.query_params.get('sortby')
        available = self.request.query_params.get('available')
        commission = self.request.query_params.get('commission')
        status_filter = self.request.query_params.get('status')

        if user.role == 'organization':
            qs = JobOffer.objects.filter(listing__author=user, status__in=['pending', 'cancelled'])
            if available == '1':
                qs = qs.filter(allDays=True)
            if commission == '1':
                qs = qs.annotate(required_commission=F('listing__commission')).filter(
                    commission__gte=F('required_commission')
                )
            if status_filter == 'cancelled':
                qs = qs.filter(status=status_filter)
            elif status_filter == 'pending':
                qs = qs.exclude(status='cancelled')
        elif user.role == 'vendor':
            qs = JobOffer.objects.filter(vendor=user).exclude(status__in=['confirmed', 'cancelled'])
            if status_filter in ['approved', 'pending', 'rejected', 'cancelled']:
                qs = qs.filter(status=status_filter)
        else:
            qs = JobOffer.objects.none()

        if sort_field == 'start_date':
            qs = qs.order_by('listing__start_date', 'listing__start_time')
        else:
            qs = qs.order_by('-time_created')

        return qs


class UpdateOfferStatusView(generics.RetrieveUpdateAPIView):
    serializer_class = OfferStatusSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'organization':
            return JobOffer.objects.filter(listing__author=user)
        elif user.role == 'vendor':
            return JobOffer.objects.filter(vendor=user)
        raise PermissionError('User cannot edit offer status')

    def update(self, request, *args, **kwargs):
        status_value = request.data.get('status')
        if status_value not in ['pending', 'approved', 'rejected', 'confirmed', 'cancelled']:
            return Response({'status': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)

        if status_value == 'confirmed':
            if request.user.role != 'vendor':
                raise PermissionError('User cannot confirm offers.')

            if request.data.get('agreement') == 'false':
                return Response(
                    {'agreement': 'Please agree to the Terms and Conditions.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            instance = self.get_object()
            fundraiser, _ = Fundraiser.objects.get_or_create(listing=instance.listing)
            vendor_fundraiser = VendorFundraiser.objects.create(offer=instance, org_fundraiser=fundraiser)

            inv_data = request.data.get('inventory', None)
            if inv_data:
                products = json.loads(inv_data)
                for product in products:
                    if len(product['Item'].strip()) == 0:
                        return Response({'name': 'Product name cannot be blank'}, status=status.HTTP_400_BAD_REQUEST)
                    if product['Quantity'] <= 0:
                        return Response({'quantity': 'Quantity must be greater than 0.'}, status=status.HTTP_400_BAD_REQUEST)
                    if product['Price'] < 0:
                        return Response({'price': 'Price cannot be negative.'}, status=status.HTTP_400_BAD_REQUEST)
                    if not isinstance(product['Quantity'], int):
                        return Response({'quantity': 'Quantity must be a whole number.'}, status=status.HTTP_400_BAD_REQUEST)
                    Product.objects.create(
                        name=product['Item'], quantity=product['Quantity'],
                        price=product['Price'], remarks=product['Remarks'],
                        vendor=vendor_fundraiser
                    )

        return super().update(request, *args, **kwargs)

    lookup_field = 'offer_id'


class DeleteOfferView(generics.RetrieveDestroyAPIView):
    serializer_class = JobOfferSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'organization':
            return JobOffer.objects.filter(listing__author=user)
        elif user.role == 'vendor':
            return JobOffer.objects.filter(vendor=user)
        raise PermissionError('User cannot delete offers.')

    lookup_field = 'offer_id'


class FundraiserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        status_filter = request.query_params.get('status')

        if user.role == 'organization':
            qs = list(Fundraiser.objects.filter(listing__author=user).order_by(
                'listing__start_date', 'listing__start_time'
            ))
            for f in qs:
                f.refresh_status()
            if status_filter:
                qs = [f for f in qs if f.status == status_filter]
            return Response(FundraiserSerializer(qs, many=True).data)

        elif user.role == 'vendor':
            qs = list(VendorFundraiser.objects.filter(offer__vendor=user).order_by(
                'org_fundraiser__listing__start_date', 'org_fundraiser__listing__start_time'
            ))
            for vf in qs:
                vf.org_fundraiser.refresh_status()
            if status_filter:
                qs = [vf for vf in qs if vf.org_fundraiser.status == status_filter]
            return Response(VendorFundraiserSerializer(qs, many=True).data)

        raise PermissionError('User cannot view fundraisers.')


class RetrieveFundraiserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, fundraiser_id):
        user = request.user

        if user.role == 'organization':
            fundraiser = get_object_or_404(Fundraiser, fundraiser_id=fundraiser_id, listing__author=user)
            fundraiser.refresh_status()
            return Response(FundraiserSerializer(fundraiser).data)

        elif user.role == 'vendor':
            fundraiser = get_object_or_404(VendorFundraiser, fundraiser_id=fundraiser_id, offer__vendor=user)
            fundraiser.org_fundraiser.refresh_status()
            return Response(VendorFundraiserSerializer(fundraiser).data)

        raise PermissionError('User cannot view fundraisers.')


class UpdateInventoryView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, fundraiser_id):
        if request.user.role != 'vendor':
            raise PermissionError('User cannot edit inventory.')

        vendor_fundraiser = get_object_or_404(VendorFundraiser, fundraiser_id=fundraiser_id)
        if request.user != vendor_fundraiser.offer.vendor:
            raise PermissionError("User cannot edit this fundraiser's inventory.")

        inv_data = request.data.get('inventory', None)
        if inv_data:
            products = json.loads(inv_data)
            Product.objects.filter(vendor=vendor_fundraiser).delete()
            for product in products:
                if len(product['Item'].strip()) == 0:
                    return Response({'name': 'Product name cannot be blank'}, status=status.HTTP_400_BAD_REQUEST)
                if product['Quantity'] <= 0:
                    return Response({'quantity': 'Quantity must be greater than 0.'}, status=status.HTTP_400_BAD_REQUEST)
                if product['Price'] < 0:
                    return Response({'price': 'Price cannot be negative.'}, status=status.HTTP_400_BAD_REQUEST)
                if not isinstance(product['Quantity'], int):
                    return Response({'quantity': 'Quantity must be a whole number.'}, status=status.HTTP_400_BAD_REQUEST)
                Product.objects.create(
                    name=product['Item'], quantity=product['Quantity'],
                    price=product['Price'], remarks=product['Remarks'],
                    vendor=vendor_fundraiser
                )
            return Response({'inventory_update': 'Update successful.'}, status=status.HTTP_200_OK)

        return Response({'inventory_update': 'No inventory provided.'}, status=status.HTTP_400_BAD_REQUEST)


class CreateTransactionView(generics.CreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != 'vendor':
            raise PermissionError('User cannot make transactions.')
        vendor_fundraiser_id = self.kwargs.get('vendor_fundraiser_id')
        vendor_fundraiser = get_object_or_404(VendorFundraiser, fundraiser_id=vendor_fundraiser_id)
        serializer.save(vendor=vendor_fundraiser)


class TransactionListView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'vendor':
            vendor_fundraiser_id = self.kwargs.get('vendor_fundraiser_id')
            vendor_fundraiser = get_object_or_404(VendorFundraiser, fundraiser_id=vendor_fundraiser_id)
            return Transaction.objects.filter(vendor=vendor_fundraiser)
        return Transaction.objects.none()


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
        user = User.objects.get(id=request.user.id)
        messages = Message.objects.filter(Q(sender=user) | Q(receiver=user)).order_by('time_created')

        receivers = set()
        for msg in messages:
            other = msg.receiver if msg.sender == user else msg.sender
            receivers.add(other)

        chats = []
        for receiver in receivers:
            msgs = Message.objects.filter(
                sender__in=[user, receiver],
                receiver__in=[user, receiver]
            ).order_by('time_created')
            chats.append({'chat_history': msgs, 'me': user, 'other': receiver})

        return Response(ChatSerializer(chats, many=True).data)


class CreateReviewView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        fundraiser_id = self.kwargs.get('fundraiser_id')
        vendor_fundraiser = VendorFundraiser.objects.get(fundraiser_id=fundraiser_id)
        reviewer = self.request.user
        vendor_user = vendor_fundraiser.offer.vendor
        org_user = vendor_fundraiser.org_fundraiser.listing.author
        reviewee = org_user if reviewer == vendor_user else vendor_user
        serializer.save(reviewer=reviewer, vendor_fundraiser=vendor_fundraiser, reviewee=reviewee)


class ReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return Review.objects.filter(reviewee__id=user_id).order_by('-time_created')