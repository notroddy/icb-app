from django.contrib import admin
from backend.game.models import Game, GameSession, Loop

# Register your models here.
admin.site.register(Game)


class LoopInline(admin.TabularInline):
    model = Loop
    extra = 0  # No extra blank rows
    can_delete = False  # Disable the delete option

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
    )  # List all holes as separate fields
    readonly_fields = fields

    def total_score(self, obj):
        return "{:,}".format(obj.total_score)

    total_score.short_description = "Total Score"
    # Dynamically create methods for each hole score
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
    )  # Add total_score as readonly

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

    inlines = [LoopInline]  # Include the LoopInline for associated loops

    def display_total_score(self, obj):
        if isinstance(obj.total_score, str):
            return obj.total_score
        else:
            return "{:,}".format(obj.total_score)  # Format the total score with commas

    def number_of_loops(self, obj):
        return "{:,}".format(
            obj.number_of_loops
        )  # Format the number of loops with commas

    display_total_score.short_description = "Total Score"
    number_of_loops.short_description = "Number of Loops"


# Register GameSession with the custom GameSessionAdmin
admin.site.register(GameSession, GameSessionAdmin)
