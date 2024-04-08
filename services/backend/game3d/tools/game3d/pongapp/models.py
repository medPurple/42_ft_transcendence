from django.db import models


class GameSettings(models.Model):
	DEFAULT_SETTINGS = {
		'paddle_speed': 10,
		'paddle_size': 10,
		'ball_speed': 10,
		'ball_size': 10,
		'score_limit': 10
	}

	userID = models.IntegerField(unique=True)
	userName = models.CharField(max_length=200, unique=True)
	game = models.CharField(choices=GameChoice, max_length=200)
	background = models.CharField(max_length=200)
	ball_speed = models.IntegerField()
	ball_size = models.IntegerField()
	paddle_speed = models.IntegerField()
	paddle_size = models.IntegerField()
	score = models.IntegerField()
	score_limit = models.IntegerField()

	def __str__(self):
		return f'Paddle Speed: {self.paddle_speed}, Ball Speed: {self.ball_speed}, Ball Size: {self.ball_size}, Score Limit: {self.score_limit}'
