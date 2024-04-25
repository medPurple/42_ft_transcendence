from rest_framework import serializers
from .models import player

class PlayerModelSerializer(serializers.ModelSerializer):
    posX = serializers.IntegerField(read_only=True)
    posY = serializers.IntegerField(read_only=True)
    orientation = serializers.CharField(read_only=True)
    class Meta:
        model = player
        fields = ['userID', 'posX', 'posY', 'orientation']
