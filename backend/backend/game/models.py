from django.db import models

from backend.data.models import Player, Arcade

class Game(models.Model):
    name = models.CharField(max_length=100)
    release_date = models.PositiveIntegerField(null=True)
    developer = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Game"
        verbose_name_plural = "Games"

    def __str__(self):
        return f"{self.name} ({self.release_date})"



class GameSession(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(blank=True, null=True)
    arcade = models.ForeignKey(Arcade, on_delete=models.CASCADE, default=1)

    class Meta:
        verbose_name = "Game Session"
        verbose_name_plural = "Game Sessions"

    def __str__(self):
        return f"Session at {self.arcade.name} on {self.start_time.date()} by {self.player}"

    @property
    def total_score(self):
        return int(sum(loop.total_score for loop in self.loops.all()))

    @property
    def number_of_loops(self):
        return self.loops.count()

    @property
    def number_of_holes_completed(self):
        return sum(loop.number_of_holes_completed for loop in self.loops.all())
    
class Loop(models.Model):
    game_session = models.ForeignKey(GameSession, on_delete=models.CASCADE, related_name="loops")
    loop_number = models.IntegerField()

    class Meta:
        verbose_name = "Loop"
        verbose_name_plural = "Loops"

    def __str__(self):
        return f"Loop {self.loop_number} - Game Session {self.game_session.id}"

    @property
    def ordered_holes(self):
        return self.holes.all().order_by('hole_number')

    @property
    def total_score(self):
        return int(sum(hole.hole_score for hole in self.holes.all()))
    
class Hole(models.Model):
    loop = models.ForeignKey(Loop, related_name='holes', on_delete=models.CASCADE)
    hole_number = models.IntegerField()
    hole_score = models.IntegerField()

    class Meta:
        verbose_name = "Hole"
        verbose_name_plural = "Holes"

    def __str__(self):
        return f"Hole {self.hole_number} - Score: {self.hole_score}"

# class GameConfiguration(models.Model):
#     game = models.ForeignKey(Game, on_delete=models.CASCADE)
#     configuration = models.JSONField()
#     date_created = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         verbose_name = "Game Configuration"
#         verbose_name_plural = "Game Configurations"

#     def __str__(self):
#         return self.game.base_game.name
# test_configuration = {
#     "holes": 
#         {
#             "1": {
#                 "x": 10,
#                 "y": 10,
#                 "w": 10,
#                 "h": 10,
#             },
#             "2": {
#                 "x": 10,
#                 "y": 10,
#                 "w": 10,
#                 "h": 10,
#             },
#             "3": {
#                 "x": 10,
#                 "y": 10,
#                 "w": 10,
#                 "h": 10,
#             },
#             "4": {
#                 "x": 10,
#                 "y": 10,
#                 "w": 10,
#                 "h": 10,
#             },
#             "5": {
#                 "x": 10,
#                 "y": 10,
#                 "w": 10,
#                 "h": 10,
#             },
#             "6": {
#                 "x": 10,
#                 "y": 10,
#                 "w": 10,
#                 "h": 10,
#             },
#             "7": {
#                 "x": 10,
#                 "y": 10,
#                 "w": 10,
#                 "h": 10,
#             },
#             "8": {
#                 "x": 10,
#                 "y": 10,
#                 "w": 10,
#                 "h": 10,
#             },
#             "9": {
#                 "x": 10,
#                 "y": 10,
#                 "w": 10,
#                 "h": 10,
#             },
#             "10": {
#                 "x": 10,
#                 "y": 10,
#                 "w": 10,
#                 "h": 10,
#             },
#         },

# }