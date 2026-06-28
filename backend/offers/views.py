from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import F
import json
from .models import JobOffer
from .serializers import JobOfferSerializer, OfferStatusSerializer


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
        from fundraisers.models import Fundraiser, VendorFundraiser, Product

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
