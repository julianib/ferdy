from convenience import *
from profile_dbe import Profile


class User:
    def __init__(self, sid):
        self.sid = sid
        self._profile: Optional[Profile] = None

        Log.debug(f"User created: {self}")

    def __repr__(self):
        name = self.get_name()
        sid = self.sid
        return f"<User {sid=}, {name=}>"

    def get_name(self) -> str:
        if self.is_logged_in():
            return self._profile["name"]

    def get_profile_data_copy(self) -> dict:
        return self._profile.get_data_copy()

    def is_logged_in(self) -> bool:
        if self._profile:
            return True

        return False

    def log_in(self, profile):
        if self._profile:
            raise ValueError("User object already has a profile set")

        self._profile = profile

        if not self._profile["first_seen_unix"]:
            self._profile["first_seen_unix"] = int(time.time())

        self._profile["is_online"] = True
        self._profile["last_seen_unix"] = int(time.time())
        self._profile["log_in_count"] += 1

        Log.info(f"{self} logged in")

    def log_out(self):
        if not self._profile:
            raise ValueError("User object does not have a profile set")

        self._profile["is_online"] = False
        self._profile["last_seen_unix"] = int(time.time())
        self._profile = None

        Log.info(f"{self} logged out")
