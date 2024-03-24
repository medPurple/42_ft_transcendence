from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import logout
from django.shortcuts import render, redirect
from .forms import CustomProfileForm
from .serializers import CustomUserSerializer
from authentication.models import CustomUser
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# @login_required
# def user_profile(request):
# 	user = request.user
# 	try:
# 		user_profile = CustomUser.objects.get(username=user)
# 	except CustomUser.DoesNotExist:
# 		return redirect('home')
# 	return render(request, 'profil/user_profile.html',
# 		{'user_profile': user})

def edit_profile(request):
	if request.method == 'POST':
		form = CustomProfileForm(request.POST, request.FILES, instance=request.user)
		if form.is_valid():
			form.save()
			return redirect('user_profile')
	else:
		form = CustomProfileForm(instance=request.user)
	return render(request, 'profil/edit_profile.html', {'form': form})

def delete_account(request):
	if request.method == 'POST':
		user = request.user
		if not isinstance(user, AnonymousUser):
			try:
				user.delete()
			except CustomUser.DoesNotExist:
				pass  # profile does not exist
			logout(request)
			return redirect('home')
	return render(request, 'profil/delete_account.html')


