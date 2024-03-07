from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.files import File

class	CustomUser(AbstractUser):
	profile_picture = models.ImageField(null=True, blank=True, upload_to='images')
	username = models.CharField(max_length=200, unique=True, null=True)
	password = models.CharField(max_length=200, null=True)
	email = models.CharField(max_length=200, null=True)
	first_name = models.CharField(max_length=200, null=True)
	last_name = models.CharField(max_length=200, null=True)
	token = models.CharField(max_length=200, null=True, blank=True)

	def save(self, *args, **kwargs):
		if not self.profile_picture:
			default_image_path = '/app/static/images/default.jpg'
			with open(default_image_path, 'rb') as f:
				default_image = File(f)
				self.profile_picture.save('default.jpg', default_image, save=False)
		super().save(*args, **kwargs)

