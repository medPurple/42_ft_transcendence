from rest_framework import serializers
from .models import WaitingModel

class WaitingModelSerializer(serializers.ModelSerializer):

    waitingTime = serializers.DateTimeField(read_only=True)
    status = serializers.CharField(read_only=True)
    player1 = serializers.IntegerField(read_only=True)
    player2 = serializers.IntegerField(read_only=True)
    class Meta:
        model = WaitingModel
        fields = ['userID', 'waitingTime', 'game', 'status', 'player1', 'player2']
