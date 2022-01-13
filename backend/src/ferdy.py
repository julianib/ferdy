from convenience import *
from polls_db import Polls
from profile_dbe import Profile
from user import User
from profiles_db import Profiles
from roles_db import Roles


class Ferdy:
    def __init__(self, sio):
        self.sio = sio
        self.incoming_packets_queue = Queue()  # user name content p_id
        self.outgoing_packets_queue = Queue()  # users name content p_id skip

        self._last_packet_id = 0
        self._users = []

        self.polls = Polls()
        self.profiles = Profiles()
        self.roles = Roles()

    def create_user_from_sid(self, sid) -> User:
        Log.debug(f"Creating user from sid, {sid=}")
        assert sid not in [user.sid for user in self.get_users_copy()], \
            f"given sid is already used by a user, {sid=}"

        user = User(self, sid)
        self._users.append(user)
        Log.debug(f"User created, {user=}")

        return user

    def handle_connect(self, sid, address) -> bool:
        Log.debug(f"Handling connect, {sid=}, {address=}")
        assert (sid and address), "no sid and address given"
        user = self.create_user_from_sid(sid)

        if not user:
            Log.error("Refusing connection: failed to create user object")
            return False

        self.send(user, "user.connect", {
            "you": True,
            "online_profiles": self.get_online_profiles_data_copy(),
            "logged_in_user_count": self.get_logged_in_user_count(),
            "user_count": self.get_user_count(),
        })

        self.broadcast("user.connect", {
            "you": False,
            "online_profiles": self.get_online_profiles_data_copy(),
            "logged_in_user_count": self.get_logged_in_user_count(),
            "user_count": self.get_user_count(),
        }, skip_users=user)

        Log.info(f"User connected: {user}")

        return True

    def handle_disconnect(self, sid) -> None:
        Log.debug(f"Handling disconnect, {sid=}")
        user = self.get_user_by_sid(sid)
        assert user, "user object not found"

        # for broadcasting who logged out to users
        profile = None
        if user.is_logged_in():
            profile = self.handle_log_out(user, broadcast=False)

        self._users.remove(user)

        self.broadcast("user.disconnect", {
            "profile": profile.get_data_copy() if profile else None,
            "online_profiles": self.get_online_profiles_data_copy(),
            "logged_in_user_count": self.get_logged_in_user_count(),
            "user_count": self.get_user_count(),
        })

        Log.info(f"User disconnected, {user=}, {profile=}")

    # TODO provide a session token for the user (for fetch() and session)
    def handle_log_in(self, user, profile) -> None:
        Log.debug(f"Handling log in, {user=}, {profile=}")
        user.log_in(profile)

        self.send(user, "user.log_in", {
            "you": True,
            "profile": profile.get_data_copy(),
        })

        self.broadcast("user.log_in", {
            "you": False,
            "profile": profile.get_data_copy(),
        }, skip_users=user)

        self.broadcast("profile.list", {
            "data": self.profiles.get_entries_data_copy()
        })

        Log.info(f"User logged in, {user=}, {profile=}")

    def handle_log_out(self, user, broadcast) -> Profile:
        Log.debug(f"Handling log out, {user=}")
        profile = user.get_profile()
        user.log_out()

        self.send(user, "user.log_out", {
            "you": True,
            "profile": profile.get_data_copy(),
        })

        if broadcast:
            self.broadcast("user.log_out", {
                "you": False,
                "profile": profile.get_data_copy(),
            }, skip_users=user)

            self.broadcast("profile.list", {
                "data": self.profiles.get_entries_data_copy()
            })

        Log.info(f"User logged out, {user=}, {profile=}")
        return profile

    # TODO check max size of name and content
    def handle_packet(self, sid, name, content) -> None:
        Log.debug(f"Handling incoming packet, {name=}")
        user = self.get_user_by_sid(sid)
        assert user, "user object not found"
        packet_id = self.get_next_packet_id()

        Log.info(f"Queueing incoming packet #{packet_id}, {name=}, {user=}")
        self.incoming_packets_queue.put((user, name, content, packet_id))

    def get_logged_in_user_count(self) -> int:
        return len([user for user in self.get_users_copy()
                    if user.is_logged_in()])

    def get_online_profiles_data_copy(self) -> List[dict]:
        return [user.get_profile().get_data_copy()
                for user in self.get_users_copy() if user.is_logged_in()]

    def get_next_packet_id(self) -> int:
        self._last_packet_id += 1
        return self._last_packet_id

    @staticmethod
    def get_permissions() -> List[str]:
        return [
            "administrator",
            "poll.create",
            "poll.delete",
            "profile.approval",
            "profile.delete",
            "profile.update",
            "role.create",
            "role.delete",
            "role.update",
        ]

    def get_user_by_sid(self, sid) -> User:
        for user in self.get_users_copy():
            if user.sid == sid:
                return user

        raise ValueError(f"Could not find user by sid, {sid=}")

    def get_user_count(self) -> int:
        return len(self.get_users_copy())

    def get_users_copy(self) -> List[User]:
        return self._users.copy()

    def send(self, users, name, content, skip=None) -> None:
        self.outgoing_packets_queue.put((users, name, content,
                                         self.get_next_packet_id(), skip))

    def broadcast(self, name, content, skip_users=None) -> None:
        self.outgoing_packets_queue.put((self.get_users_copy(), name, content,
                                         self.get_next_packet_id(), skip_users))
