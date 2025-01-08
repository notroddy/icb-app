from django.contrib import admin

# Register your models here.

from backend.data.models import Country, State, City, Player, Arcade

admin.site.register(Country)
admin.site.register(State)
admin.site.register(City)
admin.site.register(Player)
admin.site.register(Arcade)