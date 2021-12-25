from database_entry import DatabaseEntry


class Profile(DatabaseEntry):
    def __init__(self, in_database, **kwargs):
        super().__init__(in_database, **kwargs)

    def __repr__(self):
        entry_id = self["entry_id"]
        name = self["name"]
        return f"<Profile #{entry_id}, {name=}>"

    @staticmethod
    def convert_jsonable_from_disk(jsonable: dict):
        # nothing to change
        return jsonable

    @staticmethod
    def get_default_data() -> dict:
        return {
            "avatar_external": bool(),
            "avatar_url": str(),
            "email": str(),
            "email_verified": bool(),
            "first_name": str(),
            "google_id": str(),  # str because JS can only handle up to 2^53-1
            "last_name": str(),
            "locale": str(),
            "name": str(),
            "registered_unix": int(),
        }

    @staticmethod
    def get_filter_keys() -> set:
        # no keys have to be filtered
        return set()

    def get_jsonable(self, filter_values=True) -> dict:
        # nothing to change, all data is json compatible
        return self.get_data_copy(filter_values=filter_values)
