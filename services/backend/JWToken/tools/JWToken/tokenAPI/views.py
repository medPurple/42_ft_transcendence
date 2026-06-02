from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import jwt
import datetime
import pytz
import logging

logger = logging.getLogger(__name__)


class TokenAPI(APIView):

    @staticmethod
    def get_secret():
        # Secret lu depuis settings (chargé une fois au démarrage) — pas d'appel Vault ici
        return settings.JWT_SIGNING_KEY

    @staticmethod
    def generate_token(data):
        secret = TokenAPI.get_secret()
        expiration = datetime.datetime.now(pytz.utc) + datetime.timedelta(days=7)
        payload = {
            'user_id': int(data['user_id']),
            # 'exp' est le claim standard PyJWT — vérifié automatiquement à la validation
            'exp': expiration,
        }
        token = jwt.encode(payload, secret, algorithm='HS256')
        return 'Bearer ' + token

    @staticmethod
    def decrypt_token(token):
        secret = TokenAPI.get_secret()
        token = token.replace('Bearer ', '')
        try:
            # PyJWT vérifie 'exp' automatiquement et lève ExpiredSignatureError si expiré
            payload = jwt.decode(token, secret, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            logger.warning("Token expired")
            return None
        except jwt.InvalidTokenError:
            return None

    def post(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response(
                {'success': False, 'error': 'user_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            token = TokenAPI.generate_token({'user_id': user_id})
            return Response({'token': token}, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Token generation error: {e}")
            return Response(
                {'success': False, 'error': 'Token generation failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get(self, request):
        token = request.headers.get('Authorization')
        if not token:
            return Response(
                {'success': False, 'error': 'No token provided'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        data = TokenAPI.decrypt_token(token)
        if not data:
            return Response(
                {'success': False, 'error': 'Invalid or expired token'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return Response({'success': True, 'data': data}, status=status.HTTP_200_OK)
