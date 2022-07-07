from convenience import *
from database import Database
from profile_dbe import Profile


class Profiles(Database):
    def __init__(self):
        super().__init__(Profile, "profiles.json")
        Log.debug("Making sure all profiles are set as offline")
        count = 0
        for profile in self.find_many(is_online=True):
            profile["is_online"] = False
            count += 1

        Log.debug(f"Set {count} profiles as offline")

    def create(self, google_id, **kwargs) -> Profile:
        Log.debug(f"Creating new profile, {google_id=}")
        self.find_single(google_id=google_id, raise_found=True)
        profile = self.initialize_new_entry(google_id=google_id, **kwargs)

        return profile
