from rest_framework import serializers
from .models import WaitingModel

class WaitingModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = WaitingModel
        fields = ['userID', 'waitingTime', 'game', 'status']
