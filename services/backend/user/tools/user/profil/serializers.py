from rest_framework.serializers import ModelSerializer
from authentication.models import CustomUser

class CustomUserSerializer(ModelSerializer):

	class Meta:
		model = CustomUser
		fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile_picture']
