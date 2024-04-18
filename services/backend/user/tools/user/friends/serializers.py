from rest_framework import serializer
from .models import Friend_Request
import base64 #maybe friends pp

class Friend_RequestSerializer(serializers.ModelSerializer):
	class Meta:
		model = Friend_Request
		fiels = '__all__'


