from convenience import *


class User:
    def __init__(self, sid):
        self.sid = sid

    def __repr__(self):
        sid = self.sid
        return f"<User {sid=}>"