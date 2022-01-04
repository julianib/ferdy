from database_entry import DatabaseEntry


class Role(DatabaseEntry):
    def __init__(self, in_database, **kwargs):
        super().__init__(in_database, **kwargs)

    @staticmethod
    def get_default_data() -> dict:
        return {
            "color_hex": "#777",
            "name": "<name>",
            "permissions": [],
        }

    @staticmethod
    def get_keys_to_filter() -> list:
        return []
