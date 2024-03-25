# Python functions or classes that handle HTTP requests and return HTTP responses
# Views contain the application logic, process requests, interact with models, and render responses

from django.http import JsonResponse
from django.http import HttpResponse
from django.shortcuts import render
import os

def pong(request):
	return render(request, 'pong.html')

def update_paddle_position(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        paddle_id = data.get('paddleId')
        position_y = data.get('positionY')

        # Handle received data (e.g., update game state)
        # echo back the received data for now
        return JsonResponse({
            'paddleId': paddle_id,
            'positionY': position_y,
        })

    return JsonResponse({'error': 'Invalid request method'}, status=400)
