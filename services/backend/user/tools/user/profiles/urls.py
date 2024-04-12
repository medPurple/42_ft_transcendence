from django.urls import path
from .views import CustomUserLogout, CustomUserView, CustomUserRegister, CustomUserLogin

urlpatterns = [
	path('register/', CustomUserRegister.as_view(), name='register'),
	path('login/', CustomUserLogin.as_view(), name='login'),
	path('logout/', CustomUserLogout.as_view(), name='logout'),
	path('user/', CustomUserView.as_view(), name='user'),
]
