from django.db import models

# USER MODEL
class UserHistory(models.Model):
	#userID = models.AutoField(primary_key=True)
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

	# user = models.ForeignKey(UserHistory, on_delete=models.CASCADE)
	
	scene = models.CharField(max_length=100, choices=SCENE_CHOICES, default="Cornfield")
	ball = models.IntegerField(choices=TYPE_CHOICES, default=0)
	paddle = models.IntegerField(choices=TYPE_CHOICES, default=0)
	table = models.IntegerField(choices=TYPE_CHOICES, default=0)
	score = models.IntegerField(choices=SCORE_CHOICES, default=7)
	powerups = models.BooleanField(default=False)

	def __str__(self):
		return f'{self.user}'

class group(models.Model):
	player1 = models.IntegerField()
	player2 = models.IntegerField()