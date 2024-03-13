from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.files import File
from django.dispatch import receiver
from django.db.models.signals import pre_save

class	CustomUser(AbstractUser):
	profile_picture = models.ImageField(blank=True, upload_to='images')
	username = models.CharField(max_length=200, unique=True)
	password = models.CharField(max_length=200)
	email = models.EmailField(null=True)
	first_name = models.CharField(max_length=200, null=True)
	last_name = models.CharField(max_length=200, null=True)
	token = models.CharField(max_length=200, null=True, blank=True)

@receiver(pre_save, sender=CustomUser)
def set_default_pp(sender, instance, **kwargs):
	if not instance.profile_picture:
		default_image_path = '/app/static/images/default.jpg'
		with open(default_image_path, 'rb') as f:
			default_image = File(f)
			instance.profile_picture.save('default.jpg', default_image, save=False)


