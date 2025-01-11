from django.db import models
from django.contrib.auth.models import User

class Country(models.Model):
    """Model representing a country."""
    name = models.CharField(max_length=100)
    abbreviation = models.CharField(blank=False, null=False, default="", max_length=3)
    is_international = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Country"
        verbose_name_plural = "Countries"

    def __str__(self):
        return self.name

class State(models.Model):
    """Model representing a state."""
    name = models.CharField(max_length=100)
    abbreviation = models.CharField(blank=False, null=False, default="", max_length=2)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        verbose_name = "State"
        verbose_name_plural = "States"

    def __str__(self):
        return self.name

class City(models.Model):
    """Model representing a city."""
    name = models.CharField(max_length=100)
    state = models.ForeignKey(State, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        verbose_name = "City"
        verbose_name_plural = "Cities"

    def __str__(self):
        return self.name
    
class Player(User):
    """Model representing a player."""
    bio = models.TextField(blank=True)
    country = models.ForeignKey("data.Country", on_delete=models.CASCADE)
    city = models.ForeignKey("data.City", on_delete=models.CASCADE, null=True, blank=True)
    state = models.ForeignKey("data.State", on_delete=models.CASCADE, null=True, blank=True)
    team = models.ForeignKey("data.Team", on_delete=models.CASCADE, null=True, blank=True)
    arcade = models.ForeignKey("data.Arcade", on_delete=models.CASCADE, null=True, blank=True)
    twitch = models.CharField(max_length=100, null=True)
    youtube = models.CharField(max_length=100, null=True)
    instagram = models.CharField(max_length=100, null=True)

    class Meta:
        verbose_name = "Player"
        verbose_name_plural = "Players"

    def __str__(self):
        return self.username
    
    def get_number_of_games(self):
        """Get the number of games played by the player."""
        try:
            return self.gamesession_set.filter(end_time__isnull=False).count()
        except ValueError:
            return 0
    
    def get_highest_game_score(self):
        """Get the highest total score of the player."""
        try:
            return max([game_session.total_score for game_session in self.gamesession_set.all()])
        except ValueError:
            return 0
    
    def get_average_game_score(self):
        """Get the average total score of the player."""
        if self.get_number_of_games() == 0:
            return 0
        else: 
            return sum([game_session.total_score for game_session in self.gamesession_set.all()]) / self.get_number_of_games()
    
    def get_number_of_loops(self):
        """Get the number of loops completed by the player."""
        number_of_loops = sum([game_session.loops.count() for game_session in self.gamesession_set.all()])
        return number_of_loops
    
    def get_highest_loop_score(self):
        """Get the highest loop score of the player."""
        try:
            return max([loop.total_score for game_session in self.gamesession_set.all() for loop in game_session.loops.all()])
        except ValueError:
            return 0
    
    def get_average_loop_score(self):
        """Get the average loop score of the player."""
        try:
            loops = [loop.total_score for game_session in self.gamesession_set.all() for loop in game_session.loops.all()]
            return sum(loops) / len(loops) if loops else 0
        except (ValueError, ZeroDivisionError):
            return 0

class Team(models.Model):
    """Model representing a team."""
    def __str__(self):
        return self.name
    
    def number_of_members(self):
        """Count the number of members in the team."""
        return self.player_set.count()

class Arcade(models.Model):
    """Model representing an arcade."""
    name = models.CharField(max_length=100)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    state = models.ForeignKey(State, on_delete=models.CASCADE, null=True, blank=True)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    website = models.URLField()
    phone_number = models.CharField(max_length=15)
    instagram = models.URLField()
    date_added = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
