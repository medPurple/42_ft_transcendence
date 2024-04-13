from rest_framework import serializers
from .models import CustomUser

class CustomUserRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = '__all__'

class CustomUsernameSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ('username',)

class CustomUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ('user_id',
				'profile_picture', 
				'username', 
				'email', 
				'first_name', 
				'last_name', 
				'is_online')
