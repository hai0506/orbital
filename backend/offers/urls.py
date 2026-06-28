from django.urls import path
from .views import CreateOfferView, OfferListView, UpdateOfferStatusView, DeleteOfferView

urlpatterns = [
    path('create-offer/', CreateOfferView.as_view(), name='create-offer'),
    path('offers/', OfferListView.as_view(), name='offer-list'),
    path('edit-offer-status/<int:offer_id>/', UpdateOfferStatusView.as_view(), name='edit-offer-status'),
    path('delete-offer/<int:offer_id>/', DeleteOfferView.as_view(), name='delete-offer'),
]
