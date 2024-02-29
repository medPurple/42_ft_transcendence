from django.db import models
from authentication.models import CustomUser
from django.contrib.auth.models import AbstractUser

class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    profile_picture = models.ImageField(null=True, blank=True, upload_to='images')

    def __str__(self):
        return self.user.username

# Create your models here.
