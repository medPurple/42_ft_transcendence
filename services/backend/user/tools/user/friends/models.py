from django.db import models
from profiles.models import CustomUser
from django.contrib.auth.models import AbstractUser

class FriendRequest(models.Model):
	# it will have a foreignkey relation with a user(first user) who is sending this request,
	from_user = models.ForeignKey(
		CustomUser, related_name='from_user', on_delete=models.CASCADE)
	# it will also have a foreignkey relation with another user(second user) to whom the first user is sending the request.
	to_user = models.ForeignKey(
		CustomUser, related_name='to_user', on_delete=models.CASCADE)
# Create your models here.

class BlockRequest(models.Model):
	# it will have a foreignkey relation with a user(first user) who is sending this request,
	from_user = models.ForeignKey(
		CustomUser, related_name='from_user', on_delete=models.CASCADE)
	# it will also have a foreignkey relation with another user(second user) to whom the first user is sending the request.
	to_user = models.ForeignKey(
		CustomUser, related_name='to_user', on_delete=models.CASCADE)
# Create your models here.
