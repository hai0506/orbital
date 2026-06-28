from django.urls import path
from .views import (
    FundraiserListView, RetrieveFundraiserView, UpdateInventoryView,
    CreateTransactionView, TransactionListView,
    CreateReviewView, ReviewListView,
)

urlpatterns = [
    path('fundraisers/', FundraiserListView.as_view(), name='fundraiser-list'),
    path('fundraiser/<int:fundraiser_id>/', RetrieveFundraiserView.as_view(), name='retrieve-fundraiser'),
    path('edit-inventory/<int:fundraiser_id>/', UpdateInventoryView.as_view(), name='edit-inventory'),
    path('create-transaction/<int:vendor_fundraiser_id>/', CreateTransactionView.as_view(), name='create-transaction'),
    path('transactions/<int:vendor_fundraiser_id>/', TransactionListView.as_view(), name='transaction-list'),
    path('create-review/<int:fundraiser_id>/', CreateReviewView.as_view(), name='create-review'),
    path('reviews/<int:user_id>/', ReviewListView.as_view(), name='list-review'),
]
