from database import Database
from dbe_poll import Poll
from convenience import *


class Polls(Database):
    def __init__(self):
        super().__init__(Poll, "polls.json")

    def create(self, **kwargs) -> Poll:
        Log.debug(f"Creating poll")
        poll = self.initialize_new_entry(**kwargs)
        return poll
