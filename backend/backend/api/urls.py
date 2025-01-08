# api/urls.py
from django.urls import path
from .views import PlayerInfoView, UpdateHoleScoreView, create_game_session

app_name = "api"  # This defines the namespace for the API

urlpatterns = [
    path("game-session/create/", create_game_session, name="create_game_session"),
    path(
        "game-session/<int:game_session_id>/loop/<int:loop_number>/hole/<int:hole_number>/update-score/",
        UpdateHoleScoreView.as_view(),
        name="update-hole-score",
    ),
        path('player/<int:player_id>/', PlayerInfoView.as_view(), name='player_info'),

]
