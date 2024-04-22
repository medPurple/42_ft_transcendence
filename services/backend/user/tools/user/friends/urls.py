from django.urls import path
from .views import SendFriendRequestView, FriendRequestView

urlpatterns = [
	path('send-request/', SendFriendRequestView.as_view(), name="send-request" ),
	path('friend-request/', FriendRequestView.as_view(), name="friend-request"),
]
