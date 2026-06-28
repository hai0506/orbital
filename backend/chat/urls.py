from django.urls import path
from .views import MessageListView, ChatListView

urlpatterns = [
    path('messages/<int:id>', MessageListView.as_view(), name='messages'),
    path('chats/', ChatListView.as_view(), name='chats'),
]
