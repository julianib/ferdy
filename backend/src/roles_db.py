from database import Database
from role_dbe import Role


class Roles(Database):
    def __init__(self):
        super().__init__(Role, "roles.json")
