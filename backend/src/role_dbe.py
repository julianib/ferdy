from database_entry import DatabaseEntry


class Role(DatabaseEntry):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def __repr__(self):
        name = self["name"]
        return f"<Role #{self['id']}, {name=}>"

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
