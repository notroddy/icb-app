from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from backend.game.models import GameSession, Loop, Hole
from backend.data.models import Player
from .serializers import HoleUpdateSerializer, GameSessionSerializer, PlayerSerializer

class PlayerInfoView(APIView):
    """
    API view to retrieve player information.
    """
    def get(self, request, player_id):
        """Retrieve player information by player_id."""
        try:
            player = Player.objects.get(pk=player_id)
            serializer = PlayerSerializer(player)
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Player.DoesNotExist:
            return Response({"detail": "Player not found."}, status=status.HTTP_404_NOT_FOUND)
        
@api_view(['POST'])
def create_game_session(request):
    """Create a new game session."""
    if request.method == 'POST':
        serializer = GameSessionSerializer(data=request.data)
        if serializer.is_valid():
            game_session = serializer.save()
            return Response({
                'game_session_id': game_session.id,
                'message': 'Game session created successfully!'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateHoleScoreView(APIView):
    """
    API view to update the score for a specific hole in a loop.
    If the loop does not exist, it will be created.
    If the hole does not exist, it will be created with the provided score.
    """
    def patch(self, request, game_session_id, loop_number, hole_number):
        """Update the score for a specific hole in a loop."""
        hole_score = request.data.get("hole_score")

        if hole_score is None:
            return Response({"detail": "hole_score is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            loop, created = Loop.objects.get_or_create(
                game_session_id=game_session_id, 
                loop_number=loop_number
            )

            if created:
                print(f"Loop with game_session_id {game_session_id} and loop_number {loop_number} created.")
            else:
                print(f"Loop with game_session_id {game_session_id} and loop_number {loop_number} found.")

            hole, hole_created = Hole.objects.get_or_create(
                loop=loop, hole_number=hole_number,
                defaults={"hole_score": hole_score}
            )

            if hole_created:
                print(f"Hole with hole_number {hole_number} for loop {loop_number} created with score {hole_score}.")
            else:
                print(f"Hole with hole_number {hole_number} for loop {loop_number} found.")

            if not hole_created:
                hole.hole_score = hole_score
                hole.save()

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = HoleUpdateSerializer(hole, data={"hole_score": hole_score}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


