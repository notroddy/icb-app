from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from backend.data.models import Country, State, City, Player, Arcade

class PlayerAdmin(UserAdmin):
    model = Player
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('bio', 'country', 'city', 'state', 'team', 'arcade', 'twitch', 'youtube', 'instagram')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('bio', 'country', 'city', 'state', 'team', 'arcade', 'twitch', 'youtube', 'instagram')}),
    )

admin.site.register(Country)
admin.site.register(State)
admin.site.register(City)
admin.site.register(Player, PlayerAdmin)
admin.site.register(Arcade)