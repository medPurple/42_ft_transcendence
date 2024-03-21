"""
URL configuration for user project.

The `urlpatterns` list routes URLs to views. For more information please see:
	https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
	1. Add an import:  from my_app import views
	2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
	1. Add an import:  from other_app.views import Home
	2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
	1. Import the include() function: from django.urls import include, path
	2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, reverse_lazy, include
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import RedirectView
import authentication.views
import profil.views
import profil.views_api_user
import friends.views
from rest_framework import routers
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

router = routers.DefaultRouter()
router.register(r'profiles', profil.views_api_user.CustomUserViewSet, basename='profiles')


urlpatterns = [
	path('api/', include(router.urls)),
	path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
	path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs'),
	path('api/home/', authentication.views.home, name='home'),
	path('api/signup/', authentication.views.signup, name='signup'),
	path('api/username/', authentication.views.get_user_details, name='username'),
	path('api/login/', authentication.views.user_login, name='login'),
	path('api/logout/', authentication.views.user_logout, name='logout'),
	path('admin/', admin.site.urls),
	# path('home/', authentication.views.home, name='home'),
	path('profile/', profil.views.user_profile, name='user_profile'),
	path('delete_account/', profil.views.delete_account, name='delete_account'),
	path('edit_profile/', profil.views.edit_profile, name='edit_profile'),
	path('friends/', friends.views.all_users, name="friends"),
	path('send_friend_request/<int:userID>/', friends.views.send_friend_request, name='send_friend_request'),
	path('accept_friend_request/<int:requestID>/', friends.views.accept_friend_request, name='accept_friend_request'),
	path('reject_friend_request/<int:requestID>/', friends.views.reject_friend_request, name='reject_friend_request'),
	path('profile/<int:userID>/', friends.views.friend_profile, name='friend_profile'),
	path('delete_friend/<int:userID>/', friends.views.delete_friend, name='delete_friend'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
