from database_entry import DatabaseEntry


class Poll(DatabaseEntry):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    @staticmethod
    def get_default_data() -> dict:
        return {
            "allow_multiple_choices": False,
            "body": "<body>",
            "title": "<title>",
            "votes": [],
        }

    @staticmethod
    def get_keys_to_filter() -> list:
        return []
