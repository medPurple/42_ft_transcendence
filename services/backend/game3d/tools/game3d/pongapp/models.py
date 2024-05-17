from django.db import models

# USER MODEL
class UserHistory(models.Model):
	userID = models.IntegerField(primary_key=True, unique=True)
	gamesWon = models.IntegerField()
	gamesLost = models.IntegerField()
	gamesPlayed = models.IntegerField()
	# matchsPlayed, whith whom, score, date

# GAME SETTINGS MODEL
class GameSettings(models.Model):
	SCENE_CHOICES = {
		"P": "Playground",
		"C": "Cornfield",
		"D": "Dorm",
	}

	SCORE_CHOICES = {
		7: "7",
		11: "11",
		17: "17",
	}

	TYPE_CHOICES = {
		0: "0",
		1: "1",
		2: "2",
	}

	userID = models.IntegerField(primary_key=True, unique=True)
	scene = models.CharField(max_length=100, choices=SCENE_CHOICES, default="Cornfield")
	ball = models.IntegerField(choices=TYPE_CHOICES, default=1)
	paddle = models.IntegerField(choices=TYPE_CHOICES, default=1)
	table = models.IntegerField(choices=TYPE_CHOICES, default=1)
	score = models.IntegerField(choices=SCORE_CHOICES, default=11)
	powerups = models.BooleanField(default=False)
