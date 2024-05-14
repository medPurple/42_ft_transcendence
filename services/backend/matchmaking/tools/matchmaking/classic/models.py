from django.db import models
from django.utils import timezone

class WaitingModel(models.Model):
    GameChoice = [
        ('pkm_multiplayer', 'Pokemon - Multiplayer'),
        ('pong_multiplayer', 'Pong - Multiplayer'),
        ('pong_tournament', 'Pong - Tournament'),
    ]
    userID = models.IntegerField(unique=True)
    waitingTime = models.DateTimeField(auto_now_add=True)
    game = models.CharField(choices=GameChoice, max_length=200)
    status = models.CharField(max_length=200, default='searching')