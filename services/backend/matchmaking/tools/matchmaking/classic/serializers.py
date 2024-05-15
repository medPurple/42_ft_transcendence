from rest_framework import serializers
from .models import WaitingModel

class WaitingModelSerializer(serializers.ModelSerializer):

    waitingTime = serializers.DateTimeField(read_only=True)
    status = serializers.CharField(read_only=True)
    class Meta:
        model = WaitingModel
        fields = ['userID', 'waitingTime', 'game', 'status']
