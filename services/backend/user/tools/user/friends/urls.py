from django.urls import path
from .views import SendFriend_RequestView

urlpatterns = [
	path('send-request/', SendFriend_RequestView.as_view(), name="send-request" ),
]
