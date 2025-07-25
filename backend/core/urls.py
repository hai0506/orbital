from django.urls import path
from .views import *

urlpatterns = [
    path("create-post/", CreatePostView.as_view(), name="create-post"),
    path("posts/", PostListView.as_view(), name="post-list"),
    path('delete-post/<int:post_id>/', DeletePostView.as_view(), name='delete-post'),
    path('close-post/<int:post_id>/', ClosePostView.as_view(), name='close-post'),
    path('user/profile/', get_user_profile, name='user-profile'),
    path("create-offer/", CreateOfferView.as_view(), name="create-offer"),
    path("offers/", OfferListView.as_view(), name="offer-list"),
    path('edit-offer-status/<int:offer_id>/', UpdateOfferStatusView.as_view(), name='edit-offer-status'),
    path('delete-offer/<int:offer_id>/', DeleteOfferView.as_view(), name='delete-offer'),
    path("fundraisers/", FundraiserListView.as_view(), name="fundraiser-list"),
    path("fundraiser/<int:fundraiser_id>/", RetrieveFundraiserView.as_view(), name="retrieve-fundraiser"),
    path("edit-inventory/<int:fundraiser_id>/", UpdateInventoryView.as_view(), name="edit-inventory"),
    path("create-product/", CreateProductView.as_view(), name="create-product"),
    path('edit-product/<int:product_id>/', ProductEditView.as_view(), name='edit-product'),
    path('create-transaction/<int:vendor_fundraiser_id>/', CreateTransactionView.as_view(), name='create-transaction'),
    path('transactions/<int:vendor_fundraiser_id>/', TransactionListView.as_view(), name='transaction-list'),
    path("messages/<int:id>", MessageListView.as_view(), name="messages"),
    path("chats/", ChatListView.as_view(), name="chats"),
    path('profile/', EditProfileView.as_view(), name='profile'),
    path('profiles/<int:user_id>', RetrieveProfileView.as_view(), name='retrieve-profile'),
    path('profiles/', ProfileListView.as_view(), name='list-profile'),
    path('create-review/<int:fundraiser_id>/', CreateReviewView.as_view(), name='create-review'),
    path('reviews/<int:user_id>/', ReviewListView.as_view(), name='list-review'),
]
