from rest_framework import serializers
from backend.data.models import Player
from backend.game.models import GameSession, Game, Arcade

class PlayerSerializer(serializers.ModelSerializer):
    country = serializers.SerializerMethodField()
    city = serializers.SerializerMethodField()
    state = serializers.SerializerMethodField()
    team = serializers.SerializerMethodField()
    arcade = serializers.SerializerMethodField()
    number_of_games = serializers.SerializerMethodField()
    highest_game_score = serializers.SerializerMethodField()
    average_game_score = serializers.SerializerMethodField()
    number_of_loops = serializers.SerializerMethodField()
    highest_loop_score = serializers.SerializerMethodField()
    average_loop_score = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = [
            'username', 'email', 'bio', 'country', 'city', 'state', 'team', 'arcade', 
            'twitch', 'youtube', 'instagram', 'number_of_games', 'highest_game_score', 
            'average_game_score', 'number_of_loops', 'highest_loop_score', 'average_loop_score'
        ]

    def get_country(self, obj):
        return obj.country.name if obj.country else None

    def get_city(self, obj):
        return obj.city.name if obj.city else None

    def get_state(self, obj):
        return obj.state.name if obj.state else None

    def get_team(self, obj):
        return obj.team.name if obj.team else None
    
    def get_arcade(self, obj):
        return obj.arcade.name if obj.arcade else None

    def get_number_of_games(self, obj):
        return obj.get_number_of_games()

    def get_highest_game_score(self, obj):
        return obj.get_highest_game_score()

    def get_average_game_score(self, obj):
        return obj.get_average_game_score()

    def get_number_of_loops(self, obj):
        return obj.get_number_of_loops()

    def get_highest_loop_score(self, obj):
        return obj.get_highest_loop_score()

    def get_average_loop_score(self, obj):
        return obj.get_average_loop_score()

class GameSessionSerializer(serializers.ModelSerializer):
    player = serializers.CharField(source='player.username')
    arcade = serializers.CharField(source='arcade.name')
    game = serializers.CharField(source='game.name')
    total_score = serializers.IntegerField(source='calculated_total_score')
    number_of_loops = serializers.IntegerField(source='calculated_number_of_loops')
    number_of_holes_completed = serializers.IntegerField(source='calculated_number_of_holes_completed')

    class Meta:
        model = GameSession
        fields = ['id', 'player', 'arcade', 'game', 'total_score', 'number_of_loops', 'number_of_holes_completed', 'created_at', 'updated_at']



