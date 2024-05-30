from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.files import File
from django.dispatch import receiver
from django.db.models.signals import pre_save
from django.conf import settings
import os

class	CustomUser(AbstractUser):
	user_id = models.AutoField(primary_key=True)
	profile_picture = models.ImageField(blank=True, upload_to='images')
	username = models.CharField(max_length=200, unique=True)
	password = models.CharField(max_length=200)
	email = models.EmailField(null=True, unique=True)
	first_name = models.CharField(max_length=200, null=True)
	last_name = models.CharField(max_length=200, null=True)
	is_online = models.BooleanField(default=False)
	friends = models.ManyToManyField("CustomUser", blank=True)
	is_2fa = models.BooleanField(default=False)
	otp = models.CharField(max_length=10, blank=True)
	otp_expiry_time = models.DateTimeField(blank=True, null=True)

@receiver(pre_save, sender=CustomUser)
def set_default_pp(sender, instance, **kwargs):
	if not instance.profile_picture:
		default_image_path = os.path.join(settings.BASE_DIR, 'static', 'images', 'default.jpg')
		with open(default_image_path, 'rb') as f:
			default_image = File(f)
			var = instance.profile_picture.save('default.jpg', default_image, save=False)
