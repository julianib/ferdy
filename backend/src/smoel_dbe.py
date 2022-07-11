from convenience import *
from database_entry import DatabaseEntry


class Smoel(DatabaseEntry):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def __repr__(self):
        name = self["name"]
        return f"<Smoel #{self['id']}, {name=}>"

    @staticmethod
    def get_default_data() -> dict:
        return {
            "comments": [],  # {author_id, text}
            "image_filename": "<image_filename>",
            "name": "<name>",
            "ratings": []  # {stars=1-5, profile_id}
        }

    @staticmethod
    def get_keys_to_filter() -> list:
        return []

    def add_rating(self, profile, stars: int):
        """
        Add a rating cast by a specific profile to this smoel
        """

        if type(stars) != int or stars < 1 or stars > 5:
            raise ValueError(f"'stars' must be [1-5], {stars=}")

        rating = {
            "profile_id": profile["id"],
            "stars": stars
        }
        self["ratings"].append(rating)
        self.trigger_db_write()  # .append() does not trigger db write

        Log.debug(f"Added rating: {rating}")

    def get_rating_of_profile(self, profile) -> Optional[int]:
        """
        Returns 1-5 if profile has rated, and None if not
        """

        for rating in self["rating"]:
            if rating["profile_id"] != profile["id"]:
                continue

            return rating["stars"]

        # user has not cast a vote
        return None

    def get_ratings_count(self):
        return len(self["ratings"])

    def remove_rating(self, profile):
        """
        Remove any rating made by profile, if any has been made.
        """

        for rating in self["ratings"]:
            if rating["profile_id"] != profile["id"]:
                continue

            Log.debug(f"Removing rating: {rating}")
            self["ratings"].remove(rating)
            self.trigger_db_write()  # .remove() does not trigger db write
            return

        Log.debug(f"Profile {profile} did not rate {self}")

