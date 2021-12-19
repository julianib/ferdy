from convenience import *
from user_profile import Profile


class User:
    def __init__(self, sid):
        self.sid = sid
        self._profile = None

        Log.debug(f"User created: {self}")

    def __repr__(self):
        name = self.get_name()
        sid = self.sid
        return f"<User {sid[:4]=} {name=}>"

    def get_name(self) -> str:
        if self.is_logged_in():
            return self._profile["name"]

    def get_profile(self) -> Profile:
        return self._profile

    def is_logged_in(self) -> bool:
        if self._profile:
            return True

        return False

    def log_in(self, profile):
        if self._profile:
            raise ValueError("Log in failed: already logged in")

        self._profile = profile
        Log.info(f"{self} logged in")

    def log_out(self):
        if not self._profile:
            raise ValueError("Log out failed: not logged in")

        self._profile = None
        Log.info(f"{self} logged out")