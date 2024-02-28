from django.http import JsonResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
import jwt
import os
import json

@csrf_exempt
def token_authentication(request):
	print("here")
	if request.method == 'GET':
		token = request.headers.get('Authorization')
		if token:
			print (token)
			token = token.replace('Bearer ', '')
			is_valid, decoded = token_verification(token)
			if is_valid:
				return JsonResponse({'message': 'Token authenticated successfully'})
			else:
				return JsonResponse(decoded, status=401)
		else:
			return JsonResponse({'error': 'Token not provided'}, status=400)
	return JsonResponse({'error': 'Method not allowed'}, status=405)


def token_verification(token):
	try:
		secret = os.environ.get('SECRET_KEY')
		decoded = jwt.decode(token, secret, algorithms=['HS256'])
		return True, decoded
	except jwt.ExpiredSignatureError:
		return False, {'error': 'Token expired'}
	except jwt.InvalidTokenError:
		return False, {'error': 'Invalid token'}