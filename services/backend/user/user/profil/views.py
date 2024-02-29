from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from .models import UserProfile
from .forms import UserProfileForm
from authentication.models import CustomUser

@login_required
def user_profile(request):
    user = request.user
    try:
        user_profile = UserProfile.objects.get(user=user)
    except UserProfile.DoesNotExist:
        return redirect('home')  # redirect to the home page
    return render(request, 'profil/user_profile.html', 
        {'user_profile': user_profile})

def edit_profile(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST, request.FILES, instance=request.user.userprofile)
        if form.is_valid():
            form.save()
            return redirect('user_profile')
    else:
        form = UserProfileForm(instance=request.user.userprofile)
    return render(request, 'profil/edit_profile.html', {'form': form})


def delete_account(request):
    if request.method == 'POST':
        user = request.user
        
        # delete the user's profile
        try:
            profile = UserProfile.objects.get(user=user)
            profile.delete()
        except UserProfile.DoesNotExist:
            pass  # profile does not exist
        
        # delete the user
        user.delete()
        
        logout(request)
        return redirect('home')  # redirect to the home page
    return render(request, 'profil/delete_account.html')

# Create your views here.
