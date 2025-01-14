from django.contrib import admin
from backend.game.models import Game, GameSession, Loop, Hole

class HoleInline(admin.TabularInline):
    model = Hole
    extra = 0
    readonly_fields = ('hole_number', 'hole_score', 'hole_time')
    fields = ('hole_number', 'hole_score', 'hole_time')
    can_delete = False

    def get_extra(self, request, obj=None, **kwargs):
        if obj and obj.holes.count() >= 10:
            return 0
        return 1
    
    def hole_time(self, obj):
        return obj.calculate_hole_speed_formatted()

class LoopAdmin(admin.ModelAdmin):
    list_display = ('game_session_number', 'player_name', 'loop_number', 'holes_completed', 'total_score', 'loop_time')
    inlines = [HoleInline]
    ordering = ('game_session__id', 'loop_number')
    
    def get_readonly_fields(self, request, obj=None):
        return [field.name for field in self.model._meta.fields]
    
    def game_session_number(self, obj):
        return obj.game_session.id

    def player_name(self, obj):
        return obj.game_session.player.username

    def total_score(self, obj):
        return sum(hole.hole_score for hole in obj.holes.all())

    def holes_completed(self, obj):
        return obj.holes.count()
    
    def loop_time(self, obj):
        return obj.calculate_loop_speed_formatted()
    

    game_session_number.short_description = 'Game Session Number'
    player_name.short_description = 'Player'

class GameSessionAdmin(admin.ModelAdmin):
    list_display = ('game', 'player', 'arcade',  'start_time', 'end_time',  'number_of_loops', 'number_of_holes_completed','total_score')
    ordering = ('start_time',)

    def get_readonly_fields(self, request, obj=None):
        return [field.name for field in self.model._meta.fields]

class HoleAdmin(admin.ModelAdmin):
    list_display = ('loop', 'hole_number', 'hole_score', 'start_time', 'end_time', 'hole_time')
    readonly_fields = ('start_time', 'end_time', 'hole_time')

    def hole_time(self, obj):
        return obj.calculate_hole_speed_formatted()

admin.site.register(Game)
admin.site.register(Loop, LoopAdmin)
admin.site.register(GameSession, GameSessionAdmin)
admin.site.register(Hole, HoleAdmin)
# ...existing code...


