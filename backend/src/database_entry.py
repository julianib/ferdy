from convenience import *


class DatabaseEntry(ABC):
    def __init__(self, in_database, disk_was_missing_keys, **kwargs):
        """
        Create a DB entry instance of the correct type
        """

        Log.debug("Initializing db entry")

        if not in_database:
            raise ValueError("No db given")
        if "entry_id" not in kwargs:
            raise ValueError("No entry_id in kwargs")

        default_data = self.get_default_data()

        if not default_data:
            raise ValueError("Entry's default data not set")

        if "entry_id" in default_data:
            raise ValueError("entry_id can not be in db entry default data")

        for key in kwargs:
            if key not in default_data and key != "entry_id":
                raise ValueError(f"Invalid key for db entry {self}, {key=}")

        self._type_name = type(self).__name__
        self._in_database = in_database  # the db the entry is in
        self.disk_was_missing_keys = disk_was_missing_keys

        default_data.update(kwargs)
        self._data = default_data

        Log.debug(f"Initialized db entry: {self}")

    def __getitem__(self, key):
        try:
            return self._data[key]

        except AttributeError as ex:
            Log.error(f"Attempted to get data before initialization", ex=ex)

        except KeyError as ex:
            Log.error(f"Invalid data key, {key=}", ex=ex)

    def __repr__(self):
        return f"<DB entry '{type(self).__name__}'>"

    def __setitem__(self, key, value):
        try:
            self._data[key] = value

        except AttributeError as ex:
            Log.error(f"Attempted to set data before initialization", ex=ex)

        except KeyError as ex:
            Log.error(f"Invalid data key, {key=}", ex=ex)

        self.trigger_db_write()

    def get_data_copy(self, filter_values=True) -> Optional[dict]:
        """
        Get a copy of this entry's data dict (JSON-compatible)
        """

        try:
            data_copy = self._data.copy()

        except AttributeError as ex:
            Log.error(f"Attempted to copy data before initialization",
                      ex=ex)
            return

        if filter_values and self.get_keys_to_filter():
            for key in self.get_keys_to_filter():
                data_copy[key] = "<filtered>"

        return data_copy

    def matches_kwargs(self, match_casing=False, **kwargs) -> bool:
        if match_casing:
            for key, value in kwargs.items():
                if self[key] != value:
                    return False

        else:
            for key, value in kwargs.items():
                # check if we're dealing with a string
                if type(self[key]) == type(value) == str:
                    if self[key].lower() != value.lower():
                        return False

                else:
                    if self[key] != value:
                        return False

        Log.debug(f"{self} matches kwargs")
        return True

    def trigger_db_write(self):
        """
        Tell this entry's db to write to disk, (should be) called when data is
        updated
        """

        self._in_database.write_to_disk()

    @staticmethod
    @abstractmethod
    def get_default_data() -> dict:
        """
        Get the (JSON-compatible) default data key/values of this entry type
        """

        pass

    @staticmethod
    @abstractmethod
    def get_keys_to_filter() -> list:
        """
        Get the data keys of this entry's type that should have filtered values
        """

        pass
