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
            "comments": [],  # a "comment" has author_id and text
            "image_filename": "<image_filename>",
            "name": "<name>",
            "votes": []  # a "vote" is either a like or dislike
        }

    @staticmethod
    def get_keys_to_filter() -> list:
        return []

    def add_vote(self, profile_id: int, is_like: bool):
        if type(profile_id) != int or type(is_like) != bool:
            raise ValueError("argument types must be int and bool")

        vote = {
            "is_like": is_like,
            "profile_id": profile_id
        }
        self["votes"].append(vote)
        self.trigger_db_write()  # .append() does not trigger db write

        Log.debug(f"Added vote: {vote}")

    def get_dislike_count(self):
        count = 0
        for vote in self["votes"]:
            if not vote["is_like"]:
                count += 1

        return count

    def get_like_count(self):
        count = 0
        for vote in self["votes"]:
            if vote["is_like"]:
                count += 1

        return count

    def get_vote_of_user(self, user) -> Optional[bool]:
        """
        Returns True if liked, False if disliked, and None if no vote cast
        """

        if not user.is_logged_in():
            raise UserNotLoggedIn

        profile_id = user.get_profile()["id"]

        for vote in self["votes"]:
            if vote["profile_id"] != profile_id:
                continue

            # profile id matches
            is_like = vote["is_like"]
            return is_like

        # user has not cast a vote
        return None

    def get_votes_count(self):
        return len(self["votes"])

    def remove_vote(self, profile_id: int):
        for vote in self["votes"]:
            if vote["profile_id"] == profile_id:
                Log.debug(f"Removing vote: {vote}")
                self["votes"].remove(vote)
                self.trigger_db_write()  # .remove() does not trigger db write
                return

        Log.debug(f"Profile ID {profile_id} did not vote for {self}")

    def remove_vote_of_user(self, user):
        Log.debug(f"Removing vote of user {user} from {self}")

        if not user.is_logged_in():
            raise UserNotLoggedIn

        profile_id = user.get_profile()["id"]
        self.remove_vote(profile_id)

    def set_vote_of_user(self, user, is_like: bool):
        Log.debug(f"Setting vote of {user} for {self} to {is_like=}")

        if not user.is_logged_in():
            raise UserNotLoggedIn

        if type(is_like) is not bool:
            raise ValueError("is_like must be a boolean value, "
                             f"not {type(is_like)}")

        self.remove_vote_of_user(user)

        profile_id = user.get_profile()["id"]
        self.add_vote(profile_id, is_like)
