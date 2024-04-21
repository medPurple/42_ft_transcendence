from rest_framework import serializers
from .models import FriendRequest
from profiles.models import CustomUser
import base64 #maybe friends pp

class FriendRequestSerializer(serializers.ModelSerializer):
	class Meta:
		model = FriendRequest
		fields = '__all__'

class FriendsSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ['user_id', 'username']

