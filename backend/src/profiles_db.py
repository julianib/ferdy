from convenience import *
from database import Database
from profile_dbe import Profile


class Profiles(Database):
    def __init__(self):
        super().__init__(Profile, "profiles.json")

        # on db creation, make sure all profiles are set to offline
        for profile in self.find_many(is_online=True):
            profile["is_online"] = False

    def create(self, google_id, **kwargs) -> Profile:

        Log.debug(f"Creating profile")

        self.find_single(google_id=google_id, raise_found=True)

        profile = self.initialize_new_entry(google_id=google_id, **kwargs)

        return profile
