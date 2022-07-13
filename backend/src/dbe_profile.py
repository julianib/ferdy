from database_entry import DatabaseEntry
from convenience import *


class Profile(DatabaseEntry):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def __repr__(self):
        name = self["name"]
        return f"<Profile #{self['id']}, {name=}>"

    @staticmethod
    def get_default_data() -> dict:
        return {
            "avatar_external": False,
            "avatar_filename": "default.png",
            # todo implement, decides fallback bg color if avatar doesnt load
            # also check if color is too dark for black text foreground
            # https://stackoverflow.com/questions/596216/formula-to-determine-perceived-brightness-of-rgb-color
            # "color": generate_hex_color()
            "email": "<email>",
            "email_verified": False,
            "first_name": "<first_name>",
            "google_id": "<google_id>",  # str because too big for JS number
            "is_approved": False,
            "is_online": False,
            "last_name": "<last_name>",
            "last_seen_unix": 0,
            "first_seen_unix": 0,
            "locale": "<locale>",
            "log_in_count": 0,
            "name": "<name>",
            "pending_approval": True,
            "role_ids": [],
        }

    @staticmethod
    def get_keys_to_filter() -> List[str]:
        return []
