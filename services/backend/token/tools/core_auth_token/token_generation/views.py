from django.shortcuts import render
from django.http import JsonResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
import jwt
import os

# Create your views here.

@csrf_exempt
def	token_generation(request):
	if (request.method == 'POST'):
		user_id = request.POST.get('user_id')
		token = generate(user_id)
		if (token):
			return JsonResponse({'token':token})
		else:
			return JsonResponse({'error': 'Unauthorized'}, status=405)
	return JsonResponse({'error': 'Unauthorized'}, status=405)

def generate(user_id):
	payload = {'user_id': user_id}
	secret = os.environ.get('SECRET_KEY')
	jwtoken = jwt.encode(payload, secret, algorithm='HS256')
	return jwtoken