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
from rest_framework import routers
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

router = routers.DefaultRouter()
router.register(r'profiles', profil.views_api_user.CustomUserViewSet, basename='profiles')


urlpatterns = [
	path('api/', include(router.urls)),
	path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
	path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='docs'),
	# path('api/profiles/<str:username>/', views_api_user.CustomUserViewSet.as_view({'get': 'retrieve'})),	overload the retrieve method to return the user's profile
	path('admin/', admin.site.urls),
	path('home/', authentication.views.home, name='home'),
	path('signup/', authentication.views.signup, name='signup'),
	path('login/', authentication.views.user_login, name='login'),
	path('logout/', authentication.views.user_logout, name='logout'),
	path('profile/', profil.views.user_profile, name='user_profile'),
	path('delete_account/', profil.views.delete_account, name='delete_account'),
	path('edit_profile/', profil.views.edit_profile, name='edit_profile'),
	path('api-auth/', include('rest_framework.urls')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
