from convenience import *
from database import Database
from dbe_smoel_rating import SmoelRating


class SmoelRatings(Database):
    def __init__(self):
        super().__init__(SmoelRating, "smoel_ratings.json")

    def create(self, **kwargs) -> SmoelRating:
        Log.debug(f"Creating new smoel rating")
        smoel_rating = self.initialize_new_entry(**kwargs)

        return smoel_rating

    def update_ros(self, smoel):
        ratings = self.find_many(smoel_id=smoel["id"])
        total_score = 0  # each rating has 0-4 score (1 star worst, 5 best)
        # todo impl