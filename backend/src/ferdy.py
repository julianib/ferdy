from os import initgroups
from convenience import *


class User:
    def __init__(self, sid):
        self.sid = sid


class Ferdy:
    def __init__(self, sio):
        self.sio = sio
        self.users = []
        self.incoming_packets_queue = Queue()
        self.outgoing_packets_queue = Queue()

    def handle_connect(self, sid):
        pass

    def handle_disconnect(self, user):
        pass

    def get_user_by_sid(self, sid):
        pass

