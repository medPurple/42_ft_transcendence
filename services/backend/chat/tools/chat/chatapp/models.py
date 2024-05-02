from django.db import models


class Message(models.Model):
	user_id = models.IntegerField()
	timestamp = models.DateTimeField(auto_now_add=True)
	room_name = models.CharField(max_length=255)
	message = models.TextField()
