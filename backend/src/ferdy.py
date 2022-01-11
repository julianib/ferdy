from convenience import *
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

        self.profiles = Profiles()
        self.roles = Roles()

    def create_user_from_sid(self, sid) -> User:
        assert sid not in [user.sid for user in self.get_users_copy()], \
            f"given sid is taken by user, {sid=}"

        user = User(self, sid)
        self._users.append(user)
        return user

    def handle_connect(self, sid, address) -> User:
        Log.debug(f"Handling connect, {sid=}, {address=}")
        assert (sid and address), "no sid and address given"
        user = self.create_user_from_sid(sid)

        self.send_packet_to(user, "user.connect", {
            "you": True,
            "online_profiles": self.get_online_profiles_data_copy(),
            "logged_in_user_count": self.get_logged_in_user_count(),
            "user_count": self.get_user_count(),
        })

        self.send_packet_to_all("user.connect", {
            "you": False,
            "online_profiles": self.get_online_profiles_data_copy(),
            "logged_in_user_count": self.get_logged_in_user_count(),
            "user_count": self.get_user_count(),
        }, skip=user)

        return user

    def handle_disconnect(self, user):
        Log.debug(f"Handling disconnect, {user=}")
        profile_data = None

        if user.is_logged_in():
            profile_id = user.get_profile_data_copy()["entry_id"]
            self.handle_log_out(user)
            profile_data = self.profiles.find_single(entry_id=profile_id) \
                .get_data_copy()

        self._users.remove(user)

        self.send_packet_to_all("user.disconnect", {
            "profile": profile_data,
            "online_profiles": self.get_online_profiles_data_copy(),
            "logged_in_user_count": self.get_logged_in_user_count(),
            "user_count": self.get_user_count(),
        })

    # TODO provide a session token for the user (for fetch() and session)
    def handle_log_in(self, user, profile):
        Log.debug(f"Handling log in, {user=}, {profile=}")
        user.log_in(profile)

        self.send_packet_to(user, "user.log_in", {
            "you": True,
            "profile": profile.get_data_copy(),
        })

        self.send_packet_to_all("user.log_in", {
            "you": False,
            "profile": profile.get_data_copy(),
        }, skip=user)

        self.send_packet_to_all("profile.list", {
            "profiles": self.profiles.get_entries_data_copy()
        })

    def handle_log_out(self, user):
        Log.debug(f"Handling log out, {user=}")
        profile_id = user.get_profile_data_copy()["entry_id"]
        profile_data = self.profiles.find_single(entry_id=profile_id) \
            .get_data_copy()
        user.log_out()

        self.send_packet_to(user, "user.log_out", {
            "you": True,
            "profile": profile_data,
        })

        self.send_packet_to_all("user.log_out", {
            "you": False,
            "profile": profile_data,
        }, skip=user)

        self.send_packet_to_all("profile.list", {
            "profiles": self.profiles.get_entries_data_copy()
        })

    def get_logged_in_user_count(self):
        return len([user for user in self.get_users_copy() if user.is_logged_in()])

    def get_online_profiles_data_copy(self):
        return [user.get_profile_data_copy() for user in self.get_users_copy()
                if user.is_logged_in()]

    def get_next_packet_id(self):
        self._last_packet_id += 1
        return self._last_packet_id

    def get_user_by_sid(self, sid):
        for user in self.get_users_copy():
            if user.sid == sid:
                return user

        raise ValueError(f"Could not find user by sid, {sid=}")

    def get_user_count(self):
        return len(self.get_users_copy())

    def get_users_copy(self):
        return self._users.copy()

    def send_packet_to(self, users, name, content, skip=None):
        self.outgoing_packets_queue.put((users, name, content,
                                         self.get_next_packet_id(), skip))

    def send_packet_to_all(self, name, content, skip=None):
        self.outgoing_packets_queue.put((self.get_users_copy(), name, content,
                                         self.get_next_packet_id(), skip))
