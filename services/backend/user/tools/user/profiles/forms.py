from django import forms
from django.contrib.auth.forms import UserCreationForm, SetPasswordForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
	class Meta(UserCreationForm.Meta):
		model = CustomUser
		fields = ('profile_picture',
			'username',
			'email',
			'first_name',
			'last_name'
		)


class CustomUserEditForm(forms.ModelForm):

	class Meta:
		model = CustomUser
		fields = ['profile_picture', 'username', 'email', 'first_name', 'last_name', 'is_2fa']


class CustomUserPasswordForm(SetPasswordForm):

	class Meta:
		model = CustomUser
		fields = ['new_password1', 'new_password2']


