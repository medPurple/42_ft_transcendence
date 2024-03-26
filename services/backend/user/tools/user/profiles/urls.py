from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet

router = DefaultRouter()
router.register('profiles', CustomUserViewSet, 'profiles')

urlpatterns = [
	path('', include(router.urls)),
]
