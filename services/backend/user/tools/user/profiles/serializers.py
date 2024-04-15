from rest_framework import serializers
from .models import CustomUser
import base64

class CustomUserRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = '__all__'

class CustomUsernameSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ('username',)

class CustomUserSerializer(serializers.ModelSerializer):
	profile_picture_data = serializers.SerializerMethodField()

	class Meta:
		model = CustomUser
		fields = ('user_id',
				'profile_picture_data',
				'username',
				'email',
				'first_name',
				'last_name',
				'is_online')

	def get_profile_picture_data(self, obj):
		# get binary data of image
		if obj.profile_picture:
			return base64.b64encode(obj.profile_picture.read()).decode('utf-8')
		else:
			return None
