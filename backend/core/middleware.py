# this handles jwt authentication for websockets

from channels.middleware import BaseMiddleware
from django.db import close_old_connections
from channels.db import database_sync_to_async
from django.conf import settings
import jwt
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError
from rest_framework.exceptions import AuthenticationFailed
from urllib.parse import parse_qs

@database_sync_to_async
def authenticate_websocket(token): # decodes token into user
    from django.contrib.auth.models import User
    try:
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = decoded["user_id"]
        user = User.objects.get(id=user_id)
        return user
    except (InvalidTokenError, ExpiredSignatureError, User.DoesNotExist):
        raise AuthenticationFailed("Invalid Token")
    

class JWTAuthMiddleware(BaseMiddleware): # send over to websocket
    async def __call__(self, scope, receive, send):
        close_old_connections()

        query_string = scope["query_string"].decode()
        query_params = parse_qs(query_string)
        token = query_params.get("token", None)

        if token is None or len(token)==0:
            await send({
                "type": "websocket.close",
                "code": 4000
            })
        
        try:
            user = await authenticate_websocket(token[0])
            if user:
                scope['user'] = user
            else:
                await send({
                "type": "websocket.close",
                "code": 4000
            })
            return await super().__call__(scope, receive, send)
        
        except AuthenticationFailed:
            await send({
                "type": "websocket.close",
                "code": 4002
            })