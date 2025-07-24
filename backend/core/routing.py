from django.urls import re_path, path
from .consumers import *

websocket_urlpatterns = [
    path('ws/chat/<int:id>/', ChatConsumer.as_asgi()),
]