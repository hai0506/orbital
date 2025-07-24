"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
import core.routing
from core.middleware import JWTAuthMiddleware

application = ProtocolTypeRouter({
    "http": app,
    "websocket": JWTAuthMiddleware(AuthMiddlewareStack(URLRouter(core.routing.websocket_urlpatterns)))
})