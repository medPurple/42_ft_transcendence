from django.urls import path
from .views import CustomUserLogout, CustomUsernameView, CustomUserRegister, CustomUserLogin, CustomUserView

urlpatterns = [
	path('register/', CustomUserRegister.as_view(), name='register'),
	path('login/', CustomUserLogin.as_view(), name='login'),
	path('logout/', CustomUserLogout.as_view(), name='logout'),
	path('username/', CustomUsernameView.as_view(), name='username'),
	path('user-info/', CustomUserView.as_view(), name='user-info'),

]
