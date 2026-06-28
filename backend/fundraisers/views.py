from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
import json
from .models import Fundraiser, VendorFundraiser, Product, Transaction, Review
from .serializers import (
    FundraiserSerializer, VendorFundraiserSerializer,
    TransactionSerializer, ReviewSerializer,
)


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
