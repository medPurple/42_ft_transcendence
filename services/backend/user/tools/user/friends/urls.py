from django.urls import path
from .views import FriendsView, BlockView

urlpatterns = [
	path('friends-list/', FriendsView.as_view(), name="friends-list"),
	path('friends-list/<str:username>/', FriendsView.as_view(), name="friends-list"),
	path('block-list/<str:username>/', BlockView.as_view(), name="block-list"),
]
