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
import friends.views
import profiles.views
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
	path('api/profiles/', include('profiles.urls')),
	path('api/profiles/schema/', SpectacularAPIView.as_view(), name='schema'),
	path('api/profiles/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs'),
	# path('admin/', admin.site.urls),
	# path('profile/', profil.views.user_profile, name='user_profile'),
	# path('delete_account/', profil.views.delete_account, name='delete_account'),
	# path('edit_profile/', profil.views.edit_profile, name='edit_profile'),
	# path('friends/', friends.views.all_users, name="friends"),
	# path('send_friend_request/<int:userID>/', friends.views.send_friend_request, name='send_friend_request'),
	# path('accept_friend_request/<int:requestID>/', friends.views.accept_friend_request, name='accept_friend_request'),
	# path('reject_friend_request/<int:requestID>/', friends.views.reject_friend_request, name='reject_friend_request'),
	# path('profile/<int:userID>/', friends.views.friend_profile, name='friend_profile'),
	# path('delete_friend/<int:userID>/', friends.views.delete_friend, name='delete_friend'),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
