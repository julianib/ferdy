from convenience import *
from database import Database
from profile_dbe import Profile


class Profiles(Database):
    def __init__(self):
        super().__init__(Profile, "profiles.json")

    def create(self, google_id, email, email_verified, avatar_url,
               name, first_name, last_name, locale):
        Log.debug(f"Creating profile")

        if self.match_single(google_id=google_id):
            raise ValueError("Profile with google id already exists, "
                             f"{google_id=}")

        profile = self.initialize_entry(
            avatar_external=True,
            avatar_url=avatar_url,
            email=email,
            email_verified=email_verified,
            google_id=google_id,
            first_name=first_name,
            is_online=False,
            last_name=last_name,
            last_seen_unix=0,
            locale=locale,
            name=name,
            registered_unix=int(time.time()),
        )

        return profile
