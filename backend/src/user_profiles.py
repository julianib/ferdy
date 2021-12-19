from convenience import *
from database import Database
from user_profile import Profile


class Profiles(Database):
    def __init__(self):
        super().__init__(Profile, "profiles.json")

    def create_profile(self, google_id, name):
        Log.debug(f"Creating profile")

        if not (google_id and name):
            raise ValueError("No google id or name given")

        register_unix = int(time.time())

        if self.match_single(google_id=google_id):
            raise ValueError("Profile with google id already registered, "
                             f"{google_id=}")

        profile = self.initialize_entry(
            google_id=google_id, name=name,
            register_unix=register_unix,
        )
        return profile
