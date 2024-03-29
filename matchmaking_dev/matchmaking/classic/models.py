from django.db import models
import datetime


class WaitingModel(models.Model):
    GameChoice = [
        ('pkm_multiplayer', 'Pokemon - Multiplayer'),
        ('pong_multiplayer', 'Pong - Multiplayer'),
        ('pong_tournament', 'Pong - Tournament'),
    ]
    userID = models.IntegerField()
    userName = models.CharField(max_length=200)
    waitingTime = models.TimeField(auto_now_add=True)
    position = models.IntegerField()
    game = models.CharField(choices=GameChoice,max_length=200)

    def __str__(self):
        return f"[{self.userID}] {self.userName} - Position: {self.position}, Waiting Time: {self.waitingTime - datetime.datetime.now()} seconds, Waiting for : {self.game}"
