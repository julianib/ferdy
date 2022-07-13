from database_entry import DatabaseEntry
from convenience import *


class SmoelRating(DatabaseEntry):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    @staticmethod
    def get_default_data() -> dict:
        return {
            "created_unix": int(time.time()),
            "profile_id": 0,  # req
            "smoel_id": 0,  # req
            "stars": 0,  # req
        }

    @staticmethod
    def get_keys_to_filter() -> list:
        return []
