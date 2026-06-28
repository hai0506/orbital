from rest_framework import serializers
from .models import Message
from accounts.serializers import UserSerializer


class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['message_id', 'sender', 'receiver', 'content', 'time_created', 'read']


class ChatSerializer(serializers.Serializer):
    chat_history = MessageSerializer(many=True)
    me = UserSerializer()
    other = UserSerializer()
    received = serializers.SerializerMethodField()
    preview = serializers.SerializerMethodField()

    def get_received(self, obj):
        chat = obj['chat_history']
        if not chat:
            return False
        return chat[len(chat) - 1].sender != obj['me']

    def get_preview(self, obj):
        chat = obj['chat_history']
        if not chat:
            return ''
        content = chat[len(chat) - 1].content
        return content if len(content) <= 30 else content[:27] + '...'
