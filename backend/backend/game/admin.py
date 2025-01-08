from django.contrib import admin
from backend.game.models import Game, GameSession, Loop

admin.site.register(Game)

class LoopInline(admin.TabularInline):
    """Inline admin for Loop model."""
    model = Loop
    extra = 0
    can_delete = False

    fields = (
        "loop_number",
        "total_score",
        "hole_1_score",
        "hole_2_score",
        "hole_3_score",
        "hole_4_score",
        "hole_5_score",
        "hole_6_score",
        "hole_7_score",
        "hole_8_score",
        "hole_9_score",
        "hole_10_score",
    )
    readonly_fields = fields

    def total_score(self, obj):
        """Format total score with commas."""
        return "{:,}".format(obj.total_score)

    total_score.short_description = "Total Score"

    for i in range(1, 11):
        exec(
            f"""
def hole_{i}_score(self, obj):
    return self.get_hole_score(obj, {i})
hole_{i}_score.short_description = "Hole {i}"
"""
        )

    def get_hole_score(self, obj, hole_number):
        """Helper method to retrieve the score for a specific hole."""
        hole = obj.ordered_holes.filter(hole_number=hole_number).first()
        return hole.hole_score if hole else None

class GameSessionAdmin(admin.ModelAdmin):
    """Admin for GameSession model."""
    list_display = (
        "player",
        "game",
        "display_total_score",
        "number_of_loops",
        "arcade",
        "start_time",
        "end_time",
    )
    readonly_fields = (
        "game",
        "player",
        "arcade",
        "total_score",
        "number_of_loops",
    )

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "game",
                    "player",
                    "arcade",
                    "total_score",
                    "number_of_loops",
                )
            },
        ),
    )

    inlines = [LoopInline]

    def display_total_score(self, obj):
        """Format total score with commas."""
        if isinstance(obj.total_score, str):
            return obj.total_score
        else:
            return "{:,}".format(obj.total_score)

    def number_of_loops(self, obj):
        """Format number of loops with commas."""
        return "{:,}".format(obj.number_of_loops)

    display_total_score.short_description = "Total Score"
    number_of_loops.short_description = "Number of Loops"

admin.site.register(GameSession, GameSessionAdmin)
