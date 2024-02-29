from django.db import models
from django.contrib.auth.models import AbstractUser



class	CustomUser(AbstractUser):
	profile_picture = models.ImageField(null=True, blank=True)
	username = models.CharField(max_length=200, unique=True, null=True)
	password = models.CharField(max_length=200, null=True)
	email = models.CharField(max_length=200, null=True)
	first_name = models.CharField(max_length=200, null=True)
	last_name = models.CharField(max_length=200, null=True)
	token = models.CharField(max_length=200, null=True, blank=True)


# Create your models here.
