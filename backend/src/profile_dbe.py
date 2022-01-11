from database_entry import DatabaseEntry
from convenience import *


class Profile(DatabaseEntry):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def __repr__(self):
        entry_id = self["entry_id"]
        name = self["name"]
        return f"<Profile #{entry_id}, {name=}>"

    @staticmethod
    def get_default_data() -> dict:
        return {
            "avatar_external": False,
            "avatar_url": "default.png",
            "email": "<email>",
            "email_verified": False,
            "first_name": "<first_name>",
            "google_id": "<google_id>",  # str because too big for JS number
            "is_online": False,
            "last_name": "<last_name>",
            "last_seen_unix": 0,
            "first_seen_unix": 0,
            "locale": "<locale>",
            "log_in_count": 0,
            "name": "<name>",
            "role_ids": [],
        }

    @staticmethod
    def get_keys_to_filter() -> List[str]:
        return []
