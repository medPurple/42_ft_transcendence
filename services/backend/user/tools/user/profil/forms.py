from django import forms
from authentication.models import CustomUser

class CustomProfileForm(forms.ModelForm):
	class Meta:
		model = CustomUser
		fields = ['username',
		'email',
		'first_name',
		'last_name',
		'profile_picture']
