from django.urls import path
from . import views

urlpatterns = [
    path('history/', views.chat_history.as_view(), name='chat_history'),
    path('history/<str:room_name>/', views.chat_history.as_view(), name='chat_history_room'),
]