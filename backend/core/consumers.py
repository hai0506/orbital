# this handles websocket messaging

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json
from django.contrib.auth.models import User
from .models import Message

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        sender = self.scope['user']
        if not sender.is_authenticated:
            await self.close()
            return
        self.sender = sender

        receiver_id = self.scope['url_route']['kwargs']['id']
        try:
            self.receiver = await database_sync_to_async(User.objects.get)(id=receiver_id)
        except User.DoesNotExist:
            await self.close()
            return
        
        user_ids = sorted([int(sender.id), int(receiver_id)])
        self.room_name = f"chat_{user_ids[0]}-{user_ids[1]}"
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        content = data['message']
        message = await database_sync_to_async(Message.objects.create)(
            sender=self.sender,
            receiver=self.receiver,
            content=content
        )
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "chat_message",
                "message": message.content,
                "sender": self.sender.id,
                "receiver": self.receiver.id,
                "time_created": message.time_created.isoformat(),
                "read": message.read
            }
        )

    async def chat_message(self, event):
       await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
            "receiver": event["receiver"],
            "time_created": event["time_created"],
            "read": event["read"],
        }))