from rest_framework import serializers
from .models import CustomUser

class CustomUserRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = '__all__'

class CustomUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ('username',)