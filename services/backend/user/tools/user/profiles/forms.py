from django import forms
from django.contrib.auth.forms import UserCreationForm
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
        fields = ['profile_picture', 'username', 'email', 'first_name', 'last_name']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['profile_picture'].widget.attrs.update({'accept': 'image/*'})  # Permet d'accepter uniquement les images

    # Définissez une méthode clean_profile_picture pour valider et traiter le fichier de l'image
    def clean_profile_picture(self):
        profile_picture = self.cleaned_data.get('profile_picture')
        # Effectuez ici les validations ou traitements nécessaires sur l'image
        return profile_picture


class CustomUserPasswordForm(forms.ModelForm):
    # new_password = forms.CharField(widget=forms.PasswordInput)
    # confirm_password = forms.CharField(widget=forms.PasswordInput)
    class Meta:
        model = CustomUser
        fields = ['password',]
        # , 'new_password', 'confirm_password']

    # def clean(self):
    #     cleaned_data = super().clean()
    #     password = cleaned_data.get("new_password")
    #     confirm_password = cleaned_data.get("confirm_password")

    #     if password != confirm_password:
    #         self.add_error('confirm_password', "Password does not match")

    #     return cleaned_data
