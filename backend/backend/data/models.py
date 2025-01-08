from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Country(models.Model):
    name = models.CharField(max_length=100)
    abbreviation = models.CharField(blank=False, null=False, default="", max_length=3)

    class Meta:
        verbose_name = "Country"
        verbose_name_plural = "Countries"

    def __str__(self):
        return self.name


class State(models.Model):
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "State"
        verbose_name_plural = "States"

    def __str__(self):
        return self.name


class City(models.Model):
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    state = models.ForeignKey(State, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "City"
        verbose_name_plural = "Cities"

    def __str__(self):
        return self.name
    
class Player(User):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True, related_name="player_profile"
    )
    bio = models.TextField(blank=True)
    country = models.ForeignKey("data.Country", on_delete=models.CASCADE)
    city = models.ForeignKey("data.City", on_delete=models.CASCADE, null=True, blank=True)
    state = models.ForeignKey("data.State", on_delete=models.CASCADE, null=True, blank=True)
    team = models.ForeignKey("data.Team", on_delete=models.CASCADE, null=True, blank=True)
    home_arcade = models.ForeignKey("data.Arcade", on_delete=models.CASCADE, null=True, blank=True)
    twitch = models.CharField(max_length=100, null=True)
    youtube = models.CharField(max_length=100, null=True)
    instagram = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.username


class Team(models.Model):
    name = models.CharField(max_length=100)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    website = models.URLField()
    instagram = models.URLField()
    date_added = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    def number_of_members(self):
        return self.player_set.count()

class Arcade(models.Model):
    name = models.CharField(max_length=100)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    website = models.URLField()
    phone_number = models.CharField(max_length=15)
    instagram = models.URLField()
    date_added = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name