from django.db import models
import datetime


class WaitingList(models.Model):
    GameChoice = [
        ('pkm_multiplayer'),
        ('pong_multiplayer'),
        ('pong_tournament'),
    ]
    userID = models.IntegerField()
    userName = models.CharField()
    waitingTime = models.TimeField(auto_now_add=True)
    position = models.IntegerField()
    game = models.CharField(choices=GameChoice)

    def __str__(self):
        return f"[{self.userID}] {self.userName} - Position: {self.position}, Waiting Time: {self.waitingTime - datetime.datetime.now()} seconds, Waiting for : {self.game}"
