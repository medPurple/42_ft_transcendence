import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Message
from .serializers import MessageSerializer
import logging

logger = logging.getLogger(__name__)


def validate_token(request):
    """Valide le token JWT auprès du service JWToken. Retourne user_id ou None."""
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    try:
        response = requests.get(
            'https://JWToken:4430/api/token/',
            headers={'Authorization': auth_header}
        )
        data = response.json()
        if data.get('success') is True:
            return data.get('data', {}).get('user_id')
    except Exception as e:
        logger.warning(f"Token validation failed: {e}")
    return None


class chat_history(APIView):
    def get(self, request, room_name=None):
        user_id = validate_token(request)
        if not user_id:
            return Response(
                {'success': False, 'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            if room_name:
                messages = Message.objects.filter(room_name=room_name)
            else:
                messages = Message.objects.all()
            serializer = MessageSerializer(messages, many=True)
            return Response({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"chat_history error: {e}")
            return Response(
                {'success': False, 'error': 'Internal server error'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
