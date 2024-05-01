from django.db import models


class ChatUser(models.Model):
    usernamechat = models.CharField(max_length=255, unique=True)

class Message(models.Model):
    user = models.ForeignKey(ChatUser, on_delete=models.CASCADE)
    room_name = models.CharField(max_length=255)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)