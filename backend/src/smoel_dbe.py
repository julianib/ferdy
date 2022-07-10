from database_entry import DatabaseEntry


class Smoel(DatabaseEntry):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    @staticmethod
    def get_default_data() -> dict:
        return {
            "image_filename": "<image_filename>",
            "name": "<name>",
            "votes": [
                {
                    "is_upvote": True,
                    "user_id": 1
                },
                {
                    "is_upvote": False,
                    "user_id": 3
                }
            ],
        }

    @staticmethod
    def get_keys_to_filter() -> list:
        return []

    def get_downvote_count(self):
        count = 0
        for vote in self["votes"]:
            if not vote["is_upvote"]:
                count += 1

        return count

    def get_upvote_count(self):
        count = 0
        for vote in self["votes"]:
            if vote["is_upvote"]:
                count += 1

        return count

    def get_votes(self):
        return self["votes"]

    def get_votes_count(self):
        return len(self["votes"])