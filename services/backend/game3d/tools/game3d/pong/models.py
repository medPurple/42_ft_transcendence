# Models represent the structure and behavior of the application's data
# Python classes define the models, and Django ORM translates these classes into database tables

from django.db import models

class	UserSettings:
	def __init__(self, user):
		self.userID = user
		self.settings = {}
	
	@classmethod
	# def getSettings(self):
	# 	return self.settings

	# def getUserID(self):
	# 	return self.userID

