from convenience import *
from dbe_profile import Profile


class User:
    def __init__(self, ferdy, sid):
        self.ferdy = ferdy
        self.sid = sid
        self._profile: Optional[Profile] = None

    def __repr__(self):
        name = self.get_name()
        sid = self.sid
        return f"<User {sid=}, {name=}>"

    def get_name(self) -> str:
        if self.is_logged_in():
            return self._profile["name"]

        # raise UserNotLoggedIn

    def get_profile(self) -> Profile:
        if self.is_logged_in():
            return self._profile

        # raise UserNotLoggedIn

    def require_permission(self, permission: str) -> True:
        """
        Requires that the user has given permission, or admin bypass.
        Raises UserUnauthorized if not.
        """
        Log.debug(f"Requiring user permission: '{permission}'")

        if not self.is_logged_in():
            raise UserUnauthorized

        role_ids = self.get_profile()["role_ids"]

        for role_id in role_ids:
            role = self.ferdy.roles.find_single(id=role_id)
            if "administrator" in role["permissions"]:
                Log.debug("User has role with administrator bypass permission")
                return True

            if permission in role["permissions"]:
                Log.debug(f"User has role with permission '{permission}'")
                return True

        raise UserUnauthorized

    def is_logged_in(self) -> bool:
        if self._profile:
            return True

        return False

    # todo share profile data across users if logged in from 2 SIDs
    def log_in(self, profile):
        if self.is_logged_in():
            raise UserAlreadyLoggedIn

        if profile["is_online"]:
            raise ProfileAlreadyOnline

        self._profile = profile

        # if user never logged in before, set first seen timestamp
        if not self._profile["first_seen_unix"]:
            self._profile["first_seen_unix"] = int(time.time())

        self._profile["is_online"] = True
        self._profile["last_seen_unix"] = int(time.time())
        self._profile["log_in_count"] += 1

    def log_out(self):
        if not self.is_logged_in():
            raise UserNotLoggedIn

        self._profile["is_online"] = False
        self._profile["last_seen_unix"] = int(time.time())
        self._profile = None
