from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Message
from .serializers import MessageSerializer, ChatSerializer

User = get_user_model()


class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        receiver = self.kwargs['id']
        return Message.objects.filter(
            sender__in=[self.request.user, receiver],
            receiver__in=[self.request.user, receiver]
        ).order_by('time_created')


class ChatListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = User.objects.get(id=request.user.id)
        messages = Message.objects.filter(Q(sender=user) | Q(receiver=user)).order_by('time_created')

        receivers = set()
        for msg in messages:
            other = msg.receiver if msg.sender == user else msg.sender
            receivers.add(other)

        chats = []
        for receiver in receivers:
            msgs = Message.objects.filter(
                sender__in=[user, receiver],
                receiver__in=[user, receiver]
            ).order_by('time_created')
            chats.append({'chat_history': msgs, 'me': user, 'other': receiver})

        return Response(ChatSerializer(chats, many=True).data)
