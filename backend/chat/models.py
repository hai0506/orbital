from django.db import models


class Message(models.Model):
    message_id = models.AutoField(primary_key=True)
    sender = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE, related_name='sent_messages'
    )
    receiver = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE, related_name='received_messages'
    )
    content = models.TextField()
    time_created = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
