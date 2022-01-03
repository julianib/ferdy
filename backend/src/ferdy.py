from convenience import *
from user import User
from user_profiles import Profiles


class Ferdy:
    def __init__(self, sio):
        self.sio = sio
        self.incoming_packets_queue = Queue()  # user name content p_id
        self.outgoing_packets_queue = Queue()  # users name content p_id skip

        self._last_packet_id = 0
        self._users = set()

        self.profiles = Profiles()

    def create_user_from_sid(self, sid) -> User:
        if sid in [user.sid for user in self.get_users()]:
            raise ValueError(f"Given sid is taken by user, {sid=}")

        user = User(sid)
        self._users.add(user)
        return user

    def handle_connect(self, sid, address) -> User:
        if not (sid and address):
            raise ValueError(f"No sid or address given")

        user = self.create_user_from_sid(sid)

        self.send_packet_to(user, "user.connected", {
            "you": True,
            "users": [user.sid for user in self.get_users()],
            "user_count": self.get_user_count(),
        })

        self.send_packet_to_all("user.connected", {
            "you": False,
            "users": [user.sid for user in self.get_users()],
            "user_count": self.get_user_count(),
        }, skip=user)

        return user

    def handle_disconnect(self, user):
        self._users.remove(user)

        self.send_packet_to_all("user.disconnected", {
            "sid": user.sid,
            "users": [user.sid for user in self.get_users()],
            "user_count": self.get_user_count(),
        })

    def get_users(self):
        return self._users.copy()

    def get_next_packet_id(self):
        self._last_packet_id += 1
        return self._last_packet_id

    def get_user_by_sid(self, sid):
        for user in self.get_users():
            if user.sid == sid:
                return user

        raise ValueError(f"Could not find user by sid, {sid=}")

    def get_user_count(self):
        return len(self.get_users())

    def send_packet_to(self, users, name, content, skip=None):
        self.outgoing_packets_queue.put((users, name, content,
                                         self.get_next_packet_id(), skip))

    def send_packet_to_all(self, name, content, skip=None):
        self.outgoing_packets_queue.put((self.get_users(), name, content,
                                         self.get_next_packet_id(), skip))