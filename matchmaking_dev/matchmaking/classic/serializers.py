from rest_framework import serializers
from .models import WaitingModel

class WaitingModelSerializer(serializers.ModelSerializer):
    position = serializers.IntegerField(read_only=True)
    class Meta:
        model = WaitingModel
        fields = ['userID', 'userName', 'waitingTime', 'position', 'game']
