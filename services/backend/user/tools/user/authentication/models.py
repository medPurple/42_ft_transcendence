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
		# Vérifier si l'utilisateur n'a pas déjà une image de profil
		if not self.profile_picture:
			# Utiliser une image par défaut si aucune image n'est fournie
			default_image_path = '/app/static/images/default.jpg'
			with open(default_image_path, 'rb') as f:
				# Créer un objet File à partir de l'image par défaut
				default_image = File(f)
				# Ajouter l'image par défaut au champ profile_picture
				self.profile_picture.save('default.jpg', default_image, save=False)
		super().save(*args, **kwargs)

