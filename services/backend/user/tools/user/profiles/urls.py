from django.urls import path
from .views import CustomUserLogout, CustomUsernameView, CustomUserRegister, CustomUserLogin, CustomUserView, CustomUserEditView, CustomUserPasswordView, CustomUserDeleteView, AllCustomUserView

urlpatterns = [
	path('register/', CustomUserRegister.as_view(), name='register'),
	path('login/', CustomUserLogin.as_view(), name='login'),
	path('logout/', CustomUserLogout.as_view(), name='logout'),
	path('username/', CustomUsernameView.as_view(), name='username'),
	path('user-info/', CustomUserView.as_view(), name='user-info'),
	path('edit-profile/', CustomUserEditView.as_view(), name='edit-profile'),
	path('update-password/', CustomUserPasswordView.as_view(), name='update-password'),
	path('delete-account/', CustomUserDeleteView.as_view(), name='delete-account'),
	path('all-users/', AllCustomUserView.as_view(), name='all-users')
]
