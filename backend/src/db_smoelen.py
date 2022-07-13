from database import Database
from dbe_smoel import Smoel
from convenience import *


class Smoelen(Database):
    def __init__(self):
        super().__init__(Smoel, "smoelen.json")

    def create(self, **kwargs) -> Smoel:
        Log.debug(f"Creating new smoel")
        smoel = self.initialize_new_entry(**kwargs)

        return smoel
