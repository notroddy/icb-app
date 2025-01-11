from django.db import models
from backend.data.models import Player, Arcade
from django.utils import timezone

class Game(models.Model):
    """Model representing a game."""
    name = models.CharField(max_length=100)
    release_date = models.PositiveIntegerField(null=True)
    developer = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Game"
        verbose_name_plural = "Games"

    def __str__(self):
        return f"{self.name} ({self.release_date})"

class GameSession(models.Model):
    """Model representing a game session."""
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(blank=True, null=True)
    arcade = models.ForeignKey(Arcade, on_delete=models.CASCADE, default=1)
    total_score = models.IntegerField(default=0)
    number_of_loops = models.IntegerField(default=0)
    number_of_holes_completed = models.IntegerField(default=0)

    class Meta:
        verbose_name = "Game Session"
        verbose_name_plural = "Game Sessions"

    def __str__(self):
        return f"Session at {self.arcade.name} on {self.start_time.date()} by {self.player}"

    @property
    def calculated_total_score(self):
        """Calculate total score for the game session."""
        return int(sum(loop.total_score for loop in self.loops.all()))

    @property
    def calculated_number_of_loops(self):
        """Count the number of loops in the game session."""
        return self.loops.count()

    @property
    def calculated_number_of_holes_completed(self):
        """Count the number of holes completed in the game session."""
        return sum(loop.number_of_holes_completed for loop in self.loops.all())

    @property
    def is_completed(self):
        """Check if the game session is completed."""
        return self.end_time is not None

    def end_session(self):
        """Set the end time for the game session."""
        self.end_time = timezone.now()
        self.save()

    def update_score(self, loop_number, hole_number, hole_score):
        # We want to get the loop and if there isn't a loop with the given loop number, we want to create it
        loop, created = self.loops.get_or_create(loop_number=loop_number)
        # We want to get the hole and if there isn't a hole with the given hole number, we want to create it along with give it the score
        hole, created = loop.holes.get_or_create(hole_number=hole_number, defaults={'hole_score': hole_score})
        # If the hole already exists, we want to update the score
        if not created:
            hole.hole_score = hole_score
            hole.save()
        # Update the number of holes completed for the loop
        loop.number_of_holes_completed = loop.holes.count()
        loop.save()
        # If the loop has completed 10 holes, set the end time
        if loop.number_of_holes_completed == 10:
            loop.end_time = timezone.now()
            loop.save()
        # Update the total score for the loop
        loop.total_score = loop.calculated_total_score
        loop.save()
        # Update the total score for the game session
        self.total_score = self.calculated_total_score
        self.save()

        # Update the number of loops for the game session
        self.number_of_loops = self.calculated_number_of_loops
        self.save()

        # Update the number of holes completed for the game session
        self.number_of_holes_completed = self.calculated_number_of_holes_completed
        self.save()

class Loop(models.Model):
    """Model representing a loop in a game session."""
    game_session = models.ForeignKey(GameSession, on_delete=models.CASCADE, related_name="loops")
    loop_number = models.IntegerField()
    total_score = models.IntegerField(default=0)
    number_of_holes_completed = models.IntegerField(default=0)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(blank=True, null=True)

    class Meta:
        verbose_name = "Loop"
        verbose_name_plural = "Loops"

    def __str__(self):
        return f"Loop {self.loop_number} - Game Session {self.game_session.id}"

    @property
    def ordered_holes(self):
        """Get holes ordered by hole number."""
        return self.holes.all().order_by('hole_number')

    @property
    def calculated_total_score(self):
        """Calculate total score for the loop."""
        return int(sum(hole.hole_score for hole in self.holes.all()))
    
    @property
    def is_completed(self):
        """Check if the loop is completed."""
        return self.end_time is not None
    
    def end_loop(self):
        """Set the end time for the loop."""
        self.end_time = timezone.now()
        self.save()

    def calculate_loop_speed(self):
        """Calculate the speed of the loop."""
        return (self.end_time - self.start_time).total_seconds()
    
    def calculate_loop_speed_formatted(self):
        """Calculate the speed of the loop and return it in minutes, seconds, and milliseconds."""
        if self.end_time is None:
            return None
        total_seconds = (self.end_time - self.start_time).total_seconds()
        minutes = int(total_seconds // 60)
        seconds = int(total_seconds % 60)
        milliseconds = int((total_seconds * 100) % 100)
        return f"{minutes:02}:{seconds:02}.{milliseconds:02}"
    
    def save(self, *args, **kwargs):
        # Save the instance first to ensure it has a primary key
        super().save(*args, **kwargs)

class Hole(models.Model):
    """Model representing a hole in a loop."""
    loop = models.ForeignKey(Loop, related_name='holes', on_delete=models.CASCADE)
    hole_number = models.IntegerField()
    hole_score = models.IntegerField()

    class Meta:
        verbose_name = "Hole"
        verbose_name_plural = "Holes"

    def __str__(self):
        return f"Hole {self.hole_number} - Score: {self.hole_score}"