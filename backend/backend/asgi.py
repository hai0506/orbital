import os
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
import chat.routing
from chat.middleware import JWTAuthMiddleware

application = ProtocolTypeRouter({
    "http": app,
    "websocket": JWTAuthMiddleware(AuthMiddlewareStack(URLRouter(chat.routing.websocket_urlpatterns)))
})
