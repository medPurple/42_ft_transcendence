from django.contrib import admin

# Register your models here.
from .models import WaitingModel

class WuserADMIN(admin.ModelAdmin):
    list_display = ('userID', 'userName', 'waitingTime' ,'position', 'game')

admin.site.register(WaitingModel, WuserADMIN)
