# Python functions or classes that handle HTTP requests and return HTTP responses
# Views contain the application logic, process requests, interact with models, and render responses

from django.http import HttpResponse
from django.shortcuts import render
import os

def pong(request):
	# return HttpResponse('<h1>PONG 3D index page!</h1></html>')
	return render(request, 'pong.html')
