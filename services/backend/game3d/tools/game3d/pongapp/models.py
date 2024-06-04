from django.db import models

# USER MODEL
class GameUser(models.Model):
	userID = models.IntegerField(unique=True)
	userName = models.CharField(max_length=100, unique=True)
	gamesWon = models.IntegerField(default=0)
	gamesLost = models.IntegerField(default=0)
	gamesPlayed = models.IntegerField(default=0)

	def __str__(self):
		return f'{self.userName}'


# GAME SETTINGS MODEL
class GameSettings(models.Model):

	SCENES = {
		0: "Playground",
		1: "Cornfield",
		2: "Dorm",
	}

	BALLS = {
		0: "Gold",
		1: "Silver",
		2: "Diamond",
	}

	PADDLES = {
		0: "Guard A",
		1: "Guard B",
		2: "Player A",
		3: "Player B",
		4: "Boss",
	}

	TABLES = {
		0: "Metal",
		1: "Concrete",
		2: "Wooden",
	}

	SCORES = {
		7: "7",
		11: "11",
		17: "17",
	}

	user = models.ForeignKey(GameUser, on_delete=models.CASCADE)
	scene = models.IntegerField(choices=SCENES, default="Playground")
	ball = models.IntegerField(choices=BALLS, default=1)
	paddle = models.IntegerField(choices=PADDLES, default=3)
	table = models.IntegerField(choices=TABLES, default=1)
	score = models.IntegerField(choices=SCORES, default=7)
	powerups = models.BooleanField(default=False)

	def get_score(self):
		return self.score

	def __str__(self):
		return f'{self.user.userName}\'s settings'

class GameMatch(models.Model):
	GAME = {
		0: "Not_Started",
		1: "Playing",
		2: "Finished",
	}

	player1 = models.ForeignKey(GameUser, on_delete=models.PROTECT, related_name='matches_as_player1')
	player2 = models.ForeignKey(GameUser, on_delete=models.PROTECT, related_name='matches_as_player2')
	player1_score = models.IntegerField(default=0)
	player2_score = models.IntegerField(default=0)
	date = models.DateTimeField(auto_now_add=True)
	status = models.IntegerField(choices=GAME, default=0)

	# def __str__(self):
	# 	if player1 == None or player2 == None:
	# 		return f'Match {self.id}: Players not set or deleted'
	# 	return f'Match {self.id}: {self.player1.userName} vs {self.player2.userName}, {self.status}'
