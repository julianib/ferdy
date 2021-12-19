from convenience import *
from user import User


class Ferdy:
    def __init__(self, sio):
        self.sio = sio
        self.incoming_packets_queue = Queue()  # user name content p_id
        self.outgoing_packets_queue = Queue()  # users name content p_id skip

        self._last_packet_id = 0
        self._users = set()

    def create_user_from_sid(self, sid):
        if sid in [user.sid for user in self.get_all_users()]:
            raise ValueError(f"Given sid is taken by user, {sid=}")

        user = User(sid)
        self._users.add(user)
        return user

    def handle_connect(self, sid, address) -> User:
        if not (sid and address):
            raise ValueError(f"No sid or address given")

        user = self.create_user_from_sid(sid)

        if not user:
            raise ValueError("No user object given")

        self.send_packet_to(user, "user.connected.you", {
            "users_logged_in": [user.sid for user in self.get_all_users()],
            "user_count": self.get_user_count(),
        })

        self.send_packet_to_all("user.connected.other", {
            "users_logged_in": [user.sid for user in self.get_all_users()],
            "user_count": self.get_user_count(),
        }, skip=user)

        return user

    def handle_disconnect(self, user):
        # TODO handle right now right now
        pass

    def get_all_users(self):
        return self._users.copy()

    def get_next_packet_id(self):
        self._last_packet_id += 1
        return self._last_packet_id

    def get_user_by_sid(self, sid):
        for user in self.get_all_users():
            if user.sid == sid:
                return user

        raise ValueError(f"Could not get user by sid, {sid=}")

    def get_user_count(self):
        return len(self.get_all_users())

    def send_packet_to(self, users, name, content, skip=None):
        self.outgoing_packets_queue.put((users, name, content,
                                         self.get_next_packet_id(), skip))

    def send_packet_to_all(self, name, content, skip=None):
        self.outgoing_packets_queue.put((self.get_all_users(), name, content,
                                         self.get_next_packet_id(), skip))