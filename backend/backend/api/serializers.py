from rest_framework import serializers
from backend.game.models import GameSession, Loop, Hole, Player, Game, Arcade
from django.db import models

class HoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hole
        fields = ["hole_number", "hole_score"]


class LoopSerializer(serializers.ModelSerializer):
    holes = HoleSerializer(
        many=True, read_only=True
    )  # Nested serializer for holes in a loop

    class Meta:
        model = Loop
        fields = [
            "loop_number",
            "hole_one_score",
            "hole_two_score",
            "hole_three_score",
            "hole_four_score",
            "hole_five_score",
            "hole_six_score",
            "hole_seven_score",
            "hole_eight_score",
            "hole_nine_score",
            "hole_ten_score",
            "loop_time",
            "holes",
        ]

    def validate(self, data):
        # Add custom validation if needed
        return data


class GameSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameSession
        fields = ["id", "game", "player", "start_time", "end_time", "arcade"]

    def validate(self, data):
        # Add custom validation if needed
        return data

    def create(self, validated_data):
        # Create the GameSession object
        return GameSession.objects.create(**validated_data)


class HoleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hole
        fields = ["hole_number", "hole_score"]  # Only updating hole score
        read_only_fields = [
            "hole_number"
        ]  # hole_number should not be updated, as it's part of the loop

    def validate_hole_score(self, value):
        if value is None:
            raise serializers.ValidationError("Hole score cannot be null.")
        if value < 0:  # Assuming scores cannot be negative, adjust as needed
            raise serializers.ValidationError("Hole score must be a positive value.")
        return value


class PlayerSerializer(serializers.ModelSerializer):
    number_of_games = serializers.SerializerMethodField()
    state_name = serializers.SerializerMethodField()
    city_name = serializers.SerializerMethodField()
    team_name = serializers.CharField(source="team.name", read_only=True)
    home_arcade = serializers.CharField(source="home_arcade.name", read_only=True)
    highest_game_score = serializers.SerializerMethodField()
    average_game_score = serializers.SerializerMethodField()
    total_loops = serializers.SerializerMethodField()
    highest_loop_score = serializers.SerializerMethodField()
    average_loop_score = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = [
            "id",
            "username",
            "bio",
            "country",
            "state_name",
            "city_name",
            "team_name",
            "home_arcade",
            "twitch",
            "youtube",
            "instagram",
            "number_of_games",
            "highest_game_score",
            "average_game_score",
            "total_loops",
            "highest_loop_score",
            "average_loop_score",
        ]

    def get_state_name(self, obj):
        return obj.state.name if obj.state else None

    def get_city_name(self, obj):
        return obj.city.name if obj.city else None

    def get_number_of_games(self, obj):
        return GameSession.objects.filter(player=obj).count()

    def get_highest_game_score(self, obj):
        game_sessions = GameSession.objects.filter(player=obj)
        highest_score = 0
        for session in game_sessions:
            total_score = sum(loop.total_score for loop in session.loops.all())
            if total_score > highest_score:
                highest_score = total_score
        return highest_score

    def get_average_game_score(self, obj):
        game_sessions = GameSession.objects.filter(player=obj)
        total_scores = [sum(loop.total_score for loop in session.loops.all()) for session in game_sessions]
        return round(sum(total_scores) / len(total_scores) if total_scores else 0, 0)

    def get_total_loops(self, obj):
        return Loop.objects.filter(game_session__player=obj).count()

    def get_highest_loop_score(self, obj):
        loops = Loop.objects.filter(game_session__player=obj)
        highest_score = 0
        for loop in loops:
            if loop.total_score > highest_score:
                highest_score = loop.total_score
        return highest_score

    def get_average_loop_score(self, obj):
        loops = Loop.objects.filter(game_session__player=obj)
        total_scores = [loop.total_score for loop in loops]
        return round(sum(total_scores) / len(total_scores) if total_scores else 0, 0)
