from convenience import *
from profile_dbe import Profile


class User:
    def __init__(self, ferdy, sid):
        self.ferdy = ferdy
        self.sid = sid
        self._profile: Optional[Profile] = None

    def __repr__(self):
        name = self.get_name() if self.is_logged_in() else None
        sid = self.sid
        return f"<User {sid=}, {name=}>"

    def get_name(self) -> str:
        assert self.is_logged_in(), "user not logged in"
        return self._profile["name"]

    def get_profile(self) -> Profile:
        assert self.is_logged_in(), "user not logged in"
        return self._profile

    def has_permission(self, permission: str, raise_if_not: bool) -> bool:
        Log.debug(f"Checking if user has permission: {permission}")

        if not self.is_logged_in():
            if raise_if_not:
                raise UserUnauthorized

            return False

        role_ids = self.get_profile()["role_ids"]

        for role_id in role_ids:
            role = self.ferdy.roles.find_single(entry_id=role_id)
            if permission in role["permissions"]:
                return True

        if raise_if_not:
            raise UserUnauthorized

        return False

    def is_logged_in(self) -> bool:
        if self._profile:
            return True

        return False

    # todo share profile data across users if logged in from 2 SIDs
    def log_in(self, profile):
        assert not self._profile, "user object already has a profile"

        if profile["is_online"]:
            raise ProfileAlreadyOnline

        self._profile = profile

        if not self._profile["first_seen_unix"]:
            self._profile["first_seen_unix"] = int(time.time())

        self._profile["is_online"] = True
        self._profile["last_seen_unix"] = int(time.time())
        self._profile["log_in_count"] += 1

    def log_out(self):
        assert self._profile, "user object does not have a profile"

        self._profile["is_online"] = False
        self._profile["last_seen_unix"] = int(time.time())
        self._profile = None
