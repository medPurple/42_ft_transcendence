from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from authentication.models import CustomUser
from friends.models import Friend_Request
from django.http import HttpResponse

@login_required
def	send_friend_request(request, userID):
	from_user = request.user
	to_user = CustomUser.objects.get(id=userID)
	friend_request, created = Friend_Request.objects.get_or_create(
		from_user=from_user, to_user=to_user)
	if created:
		return HttpResponse('friend request sent')
	else:
		return HttpResponse('friend request was already sent')

@login_required
def	accept_friend_request(request, requestID):
	friend_request = Friend_Request.objects.get(id=requestID)
	if friend_request.to_user == request.user:
		friend_request.to_user.friends.add(friend_request.from_user)
		friend_request.from_user.friends.add(friend_request.to_user)
		friend_request.delete()
		return HttpResponse('friend request accepted')
	else:
		return HttpResponse('friend request not accepted')

@login_required
def all_users(request):
    # Récupérer tous les utilisateurs enregistrés dans votre base de données
	users = CustomUser.objects.all()
	friend_requests = Friend_Request.objects.filter(to_user=request.user)
	return render(request, 'friends.html', {'users': users, 'friend_requests' : friend_requests})

# @login_required
# def send_friend_request_page(request, userID):
#     return render(request, 'send_friend_request.html', {'userID': userID})

# @login_required
# def accept_friend_request_page(request, requestID):
#     friend_request = Friend_Request.objects.get(id=requestID)
#     return render(request, 'accept_friend_request.html', {'friend_request': friend_request})

