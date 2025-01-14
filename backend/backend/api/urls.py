from django.urls import path
from . import views
from rest_framework.authtoken import views as auth_views

urlpatterns = [
    path('login/', views.login_view),
    path('player/<int:player_id>/', views.PlayerDetailView.as_view(), name='get_player'),
    path('game-session/create/', views.create_game_session, name='create_game_session'),
    path('game-session/<int:game_session_id>/loop/<int:loop_number>/hole/<int:hole_number>/update-score/', views.update_game_session_score, name='update_game_session_score'),
    path('game-session/<int:game_session_id>/end/', views.end_game_session, name='end_game_session'),
    path('game-session/<int:game_session_id>/loop/<int:loop_number>/complete/', views.complete_loop, name='complete_loop'),
]
