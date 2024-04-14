from django.db import models
from django.utils import timezone

class WaitingModel(models.Model):
    GameChoice = [
        ('pkm_multiplayer', 'Pokemon - Multiplayer'),
        ('pong_multiplayer', 'Pong - Multiplayer'),
        ('pong_tournament', 'Pong - Tournament'),
    ]
    userID = models.IntegerField(unique=True)
    #userName = models.CharField(max_length=200, unique=True)
    waitingTime = models.DateTimeField(auto_now_add=True)
    position = models.IntegerField()
    game = models.CharField(choices=GameChoice, max_length=200)

    def waiting_duration(self):
        if self.waitingTime is not None:
            now = timezone.now()
            elapsed_time = now - self.waitingTime
            return elapsed_time.total_seconds()
        else:
            return 0  # Or handle this case as per your requirements

    def __str__(self):
        return f"[{self.userID}] - Position: {self.position}, Waiting Time: {self.waiting_duration()} seconds, Waiting for : {self.game}"
