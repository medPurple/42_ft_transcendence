from django.contrib import admin

from .models import Elem , Attack, Species#, Individual, Player

# Register your models here.

admin.site.register(Elem)
admin.site.register(Attack)
admin.site.register(Species)
# admin.site.register(Individual)
# admin.site.register(Player)