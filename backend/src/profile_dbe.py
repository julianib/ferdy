from database_entry import DatabaseEntry
from convenience import *


class Profile(DatabaseEntry):
    def __init__(self, in_database, **kwargs):
        super().__init__(in_database, **kwargs)

    def __repr__(self):
        entry_id = self["entry_id"]
        name = self["name"]
        return f"<Profile #{entry_id}, {name=}>"

    @staticmethod
    def get_default_data() -> dict:
        return {
            "avatar_external": False,
            "avatar_url": "",
            "email": "",
            "email_verified": False,
            "first_name": "",
            "google_id": "",  # str because google id is too big for a JS int
            "is_online": False,
            "last_name": "",
            "last_seen_unix": 0,
            "locale": "",
            "name": "",
            "registered_unix": 0,
            "roles": [],
        }

    @staticmethod
    def get_keys_to_filter() -> List[str]:
        return []
