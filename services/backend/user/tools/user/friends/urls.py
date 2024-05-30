from django.urls import path
from .views import FriendsView

urlpatterns = [
	path('friends-list/', FriendsView.as_view(), name="friends-list"),
	path('friends-list/<str:username>/', FriendsView.as_view(), name="bob"),
]
