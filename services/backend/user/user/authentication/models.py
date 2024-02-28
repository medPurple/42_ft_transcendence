from django.db import models
from django.contrib.auth.models import AbstractUser



class	User(AbstractUser):
	profile_picture = models.ImageField(null=True, blank=True)
	name = models.CharField(max_length=200, null=True)
	phone = models.CharField(max_length=200, null=True)
	email = models.CharField(max_length=200, null=True)
	password = models.CharField(max_length=200, null=True)


# Create your models here.
