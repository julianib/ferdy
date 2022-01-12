from database import Database
from poll_dbe import Poll
from convenience import *


class Polls(Database):
    def __init__(self):
        super().__init__(Poll, "polls.json")

    def create(self, **kwargs) -> Poll:
        Log.debug(f"Creating poll")
        poll = self.initialize_new_entry(**kwargs)
        poll["title"] = f"New poll #{poll['id']}"
        return poll
