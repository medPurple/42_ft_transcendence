from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from profiles.models import CustomUser
from friends.models import Friend_Request
from django.http import HttpResponse


@login_required
def	send_friend_request(request, userID):
	from_user = request.user
	to_user = CustomUser.objects.get(id=userID)

	# Vérifier si une demande d'ami a déjà été envoyée
	# get_or_create retourne deux valeurs: l'objet et un booléen qui indique si l'objet a été créé ou récupéré
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
def	reject_friend_request(request, requestID):
	friend_request = Friend_Request.objects.get(id=requestID)
	if friend_request.to_user == request.user:
		friend_request.delete()
		return HttpResponse('friend request rejected')
	else:
		return HttpResponse('friend request not rejected')

@login_required
def	delete_friend(request, userID):
	friend_profile = get_object_or_404(CustomUser, id=userID)
	request.user.friends.remove(friend_profile)
	friend_profile.friends.remove(request.user)
	return redirect('friends')



@login_required
def friend_profile(request, userID):
	friend = get_object_or_404(CustomUser, id=userID)
	return render(request, 'friend_profile.html', {'friend': friend})

@login_required
def all_users(request):
	# Récupérer tous les utilisateurs enregistrés dans la base de données
	users = CustomUser.objects.all()
	friend_requests = Friend_Request.objects.filter(to_user=request.user)
	return render(request, 'friends.html',
			{'users': users, 'friend_requests' : friend_requests})

