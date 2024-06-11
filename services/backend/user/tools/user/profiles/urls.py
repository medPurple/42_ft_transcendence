from django.urls import path
from .views import CustomUserVerify, CustomUserLogout, CustomUsernameView, CustomUserRegister, CustomUserLogin, CustomUserView, CustomUserEditView, CustomUserPasswordView, AllCustomUserView, CustomUserStatusView

urlpatterns = [
	path('register/', CustomUserRegister.as_view(), name='register'),
	path('login/', CustomUserLogin.as_view(), name='login'),
	path('login_2FA/', CustomUserVerify.as_view(), name='login_2FA'),
	path('logout/', CustomUserLogout.as_view(), name='logout'),
	path('username/', CustomUsernameView.as_view(), name='username'),
	path('user-info/', CustomUserView.as_view(), name='user-info'),
	path('edit-profile/', CustomUserEditView.as_view(), name='edit-profile'),
	path('update-password/', CustomUserPasswordView.as_view(), name='update-password'),
	path('all-users/', AllCustomUserView.as_view(), name='all-users'),
	path('all-users/<str:user_id>/', AllCustomUserView.as_view()),
    path('change-status/',CustomUserStatusView.as_view(), name='change-status'),

]
