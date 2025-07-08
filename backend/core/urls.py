from django.urls import path
from .views import *

urlpatterns = [
    path("create-post/", CreatePostView.as_view(), name="create-post"),
    path("posts/", PostListView.as_view(), name="post-list"),
    path('delete-post/<int:post>/', DeletePostView.as_view(), name='delete-post'),
    path('user/profile/', get_user_profile, name='user-profile'),
    path("create-offer/", CreateOfferView.as_view(), name="create-offer"),
    path("offers/", OfferListView.as_view(), name="offer-list"),
    path('edit-offer-status/<int:offer_id>/', UpdateOfferStatusView.as_view(), name='edit-offer-status'),
    path('delete-offer/<int:offer_id>/', DeleteOfferView.as_view(), name='delete-offer'),
    path("fundraisers/", FundraiserListView.as_view(), name="fundraiser-list"),
    path('profile/', EditProfileView.as_view(), name='profile')
]
