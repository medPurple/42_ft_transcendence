from rest_framework import serializers
from .models import WaitingModel

class WaitingModelSerializer(serializers.ModelSerializer):
    position = serializers.IntegerField(read_only=True)
    userName = serializers.CharField(max_length=200, read_only=True)
    waitingTime = serializers.DateTimeField(read_only=True)
    class Meta:
        model = WaitingModel
        fields = ['userID', 'userName', 'waitingTime', 'position', 'game']
