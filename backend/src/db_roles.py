from database import Database
from dbe_role import Role
from convenience import *


class Roles(Database):
    def __init__(self):
        super().__init__(Role, "roles.json")

    def create(self) -> Role:
        Log.debug(f"Creating role")
        role = self.initialize_new_entry()
        role["name"] = f"New role #{role['id']}"
        return role
