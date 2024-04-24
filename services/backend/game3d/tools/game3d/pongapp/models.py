from django.db import models


# USER MODEL
class GameUser(models.Model):
	userName = models.CharField(max_length=200, unique=True)
	userID = models.IntegerField(unique=True)
	gamesWon = models.IntegerField()
	gamesLost = models.IntegerField()
	gamesPlayed = models.IntegerField()

	def __str__(self):
		return f'{self.userName}'


# GAME SETTINGS MODEL
class GameSettings(models.Model):
	SIZE = {
		"S": "Small",
		"M": "Medium",
		"L": "Large",
	}
	
	userID = models.ForeignKey(GameUser, on_delete=models.CASCADE) #user NO CHANGES
	background = models.CharField(max_length=200) #background image NO CHANGES
	ball_size = models.CharField(max_length=1, choices=SIZE)
	paddle_size = models.CharField(max_length=1, choices=SIZE)
	ball_speed = models.IntegerField()
	paddle_speed = models.IntegerField()

	def __str__(self):
		return f'{self.userID}'