from django.urls import path
from .views import EditProfileView, ProfileListView, RetrieveProfileView, get_user_profile

urlpatterns = [
    path('user/profile/', get_user_profile, name='user-profile'),
    path('profile/', EditProfileView.as_view(), name='profile'),
    path('profiles/<int:user_id>', RetrieveProfileView.as_view(), name='retrieve-profile'),
    path('profiles/', ProfileListView.as_view(), name='list-profile'),
]
