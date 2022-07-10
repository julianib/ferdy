from database import Database
from smoel_dbe import Smoel
from convenience import *


class Smoelen(Database):
    def __init__(self):
        super().__init__(Smoel, "smoelen.json")
