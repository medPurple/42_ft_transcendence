from django.urls import path
from .views import SendFriendRequestView, FriendRequestView, FriendsView

urlpatterns = [
	path('send-request/', SendFriendRequestView.as_view(), name="send-request" ),
	path('friend-request/', FriendRequestView.as_view(), name="friend-request"),
	path('friends-list/', FriendsView.as_view(), name="friends-list"),
]
