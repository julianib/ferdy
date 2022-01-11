from convenience import *
from profile_dbe import Profile


class User:
    def __init__(self, ferdy, sid):
        self.ferdy = ferdy
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

    def has_permission(self, permission: str, raise_if_not: bool) -> bool:
        if not self.is_logged_in():
            if raise_if_not:
                raise Unauthorized

            return False

        role_ids = self.get_profile_data_copy()["role_ids"]

        for role_id in role_ids:
            role = self.ferdy.roles.find_single(entry_id=role_id)
            if permission in role["permissions"]:
                return True

        if raise_if_not:
            raise Unauthorized

        return False

    def is_logged_in(self) -> bool:
        if self._profile:
            return True

        return False

    def log_in(self, profile):
        assert not self._profile, "user object already has a profile"

        self._profile = profile

        if not self._profile["first_seen_unix"]:
            self._profile["first_seen_unix"] = int(time.time())

        self._profile["is_online"] = True
        self._profile["last_seen_unix"] = int(time.time())
        self._profile["log_in_count"] += 1

        Log.info(f"User logged in: {self}")

    def log_out(self):
        assert self._profile, "user object does not have a profile"

        self._profile["is_online"] = False
        self._profile["last_seen_unix"] = int(time.time())
        self._profile = None

        Log.info(f"User logged out: {self}")
