from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ArcadeSerializer, PlayerSerializer, GameSessionSerializer, GameSerializer
from backend.data.models import Player
from backend.game.models import GameSession, Game, Arcade, Loop, Hole
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_http_methods
from django.utils import timezone
import json
import logging
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

logger = logging.getLogger(__name__)

class PlayerDetailView(APIView):
    def get(self, request, player_id):
        try:
            player = Player.objects.get(pk=player_id)
            serializer = PlayerSerializer(player)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Player.DoesNotExist:
            return Response({'error': 'Player not found'}, status=status.HTTP_404_NOT_FOUND)

class GameListView(APIView):
    def get(self, request):
        games = Game.objects.all()
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PlayerListView(APIView):
    def get(self, request):
        players = Player.objects.all()
        serializer = PlayerSerializer(players, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ArcadeListView(APIView):
    def get(self, request):
        players = Arcade.objects.all()
        serializer = ArcadeSerializer(players, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GameDetailView(APIView):
    def get(self, request, game_id):
        try:
            game = Game.objects.get(pk=game_id)
            serializer = GameSerializer(game)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Game.DoesNotExist:
            return Response({'error': 'Game not found'}, status=status.HTTP_404_NOT_FOUND)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        username = body.get('username')
        password = body.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return JsonResponse({'token': token.key, 'user_id': user.id}, status=200)
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


def generate_token(user):
    token, _ = Token.objects.get_or_create(user=user)
    return token.key


@csrf_exempt
@require_POST
def create_game_session(request):
    try:
        logger.info('Received request to create game session')
        data = json.loads(request.body)
        game_id = data.get('game')
        player_id = data.get('player')
        arcade_id = data.get('arcade')

        player = Player.objects.get(id=player_id)
        arcade = Arcade.objects.get(id=arcade_id)
        game = Game.objects.get(id=game_id)
        start_time = timezone.now() + timezone.timedelta(seconds=3)
        game_session = GameSession.objects.create(game=game, player=player, arcade=arcade, start_time=start_time)
        
        # Create the first loop and the first hole
        first_loop = Loop.objects.create(game_session=game_session, loop_number=1, start_time=start_time)
        Hole.objects.create(loop=first_loop, hole_number=1, hole_score=1, start_time=start_time)
        
        logger.info(f'Game session created with ID: {game_session.id}')
        return JsonResponse({'game_session_id': game_session.id}, status=201)
    except Player.DoesNotExist:
        logger.error('Player does not exist')
        return JsonResponse({'error': 'Player does not exist'}, status=400)
    except Arcade.DoesNotExist:
        logger.error('Arcade does not exist')
        return JsonResponse({'error': 'Arcade does not exist'}, status=400)
    except Exception as e:
        logger.error(f'Error creating game session: {str(e)}')
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["PATCH"])
def update_game_session_score(request, game_session_id, loop_number, hole_number):
    try:
        logger.info(f'Received request to update score for game session ID: {game_session_id}, loop: {loop_number}, hole: {hole_number}')
        data = json.loads(request.body)
        hole_score = data.get('hole_score')

        if hole_score is None:
            logger.error('Hole score not provided in the request')
            return JsonResponse({'error': 'Hole score not provided'}, status=400)

        logger.info(f'Hole score received: {hole_score}')

        game_session = GameSession.objects.get(id=game_session_id)
        game_session.update_score(loop_number, hole_number, hole_score)

        logger.info(f'Score updated successfully for game session ID: {game_session_id}, loop: {loop_number}, hole: {hole_number}')
        return JsonResponse({'message': 'Score updated successfully'}, status=200)
    except GameSession.DoesNotExist:
        logger.error(f'Game session with ID {game_session_id} does not exist')
        return JsonResponse({'error': 'Game session does not exist'}, status=404)
    except ValueError as ve:
        logger.error(f'Error updating score: {str(ve)}')
        return JsonResponse({'error': str(ve)}, status=400)
    except Exception as e:
        logger.error(f'Unexpected error updating score: {str(e)}')
        return JsonResponse({'error': 'An unexpected error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["PATCH"])
def end_loop(request, game_session_id, loop_number):
    try:
        logger.info(f'Received request to end loop for game session ID: {game_session_id}, loop: {loop_number}')
        game_session = GameSession.objects.get(id=game_session_id)
        Loop.objects.get(game_session=game_session, loop_number=loop_number).end_loop()
        
        logger.info(f'Loop ended successfully for game session ID: {game_session_id}, loop: {loop_number}')
        return JsonResponse({'message': 'Loop ended successfully'}, status=200)
    except GameSession.DoesNotExist:
        logger.error(f'Game session with ID {game_session_id} does not exist')
        return JsonResponse({'error': 'Game session does not exist'}, status=404)
    except ValueError as ve:
        logger.error(f'Error ending loop: {str(ve)}')
        return JsonResponse({'error': str(ve)}, status=400)
    except Exception as e:
        logger.error(f'Unexpected error ending loop: {str(e)}')
        return JsonResponse({'error': 'An unexpected error occurred'}, status=500)
   
@csrf_exempt
@require_http_methods(["PATCH"])
def end_game_session(request, game_session_id):
    try:
        logger.info(f'Received request to end game session ID: {game_session_id}')
        game_session = GameSession.objects.get(id=game_session_id)
        game_session.end_session()
        logger.info(f'Game session ID: {game_session_id} ended successfully')
        return JsonResponse({'message': 'Game session ended successfully'}, status=200)
    except GameSession.DoesNotExist:
        logger.error(f'Game session with ID {game_session_id} does not exist')
        return JsonResponse({'error': 'Game session does not exist'}, status=404)
    except Exception as e:
        logger.error(f'Unexpected error ending game session: {str(e)}')
        return JsonResponse({'error': 'An unexpected error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["PATCH"])
def complete_loop(request, game_session_id, loop_number):
    game_session = get_object_or_404(GameSession, id=game_session_id)
    loop = get_object_or_404(Loop, game_session=game_session, loop_number=loop_number)
    loop.end_loop()
    return JsonResponse({'status': 'Loop completed', 'loop_id': loop.id})
