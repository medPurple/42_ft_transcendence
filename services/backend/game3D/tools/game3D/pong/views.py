from django.http import HttpResponse
from django.shortcuts import render

def pong(request):
	return HttpResponse('<h1>PONG 3D index page!</h1></html>')
	# return render(request, '../../../../../frontend/templates/pong.html')
