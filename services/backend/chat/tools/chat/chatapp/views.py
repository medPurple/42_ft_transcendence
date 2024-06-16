from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Message
from .serializers import MessageSerializer
import logging

logger = logging.getLogger(__name__)
# Create your views here.

class chat_history(APIView):
    def get(self, request, room_name=None):
        try:
            if room_name:
                messages = Message.objects.filter(room_name=room_name)
            else:
                messages = Message.objects.all()
            serializer = MessageSerializer(messages, many=True)
            # logger.debug(serializer.data)
            return Response({'success': True, 'data': serializer.data}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=200)