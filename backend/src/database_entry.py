from convenience import *


class DatabaseEntry(ABC):
    def __init__(self, parent_database, **kwargs):
        """
        Create a DB entry instance
        """

        Log.debug(f"Initializing DB entry, type='{type(self).__name__}'")

        default_data = self.get_default_data()

        assert parent_database, "parent_database missing"
        assert "entry_id" in kwargs, "entry_id missing from kwargs"
        assert default_data, "Entry has no default data"
        assert "entry_id" not in default_data, "entry_id key not allowed in " \
                                               "entry's default data"

        for key, value in kwargs.copy().items():
            if key not in default_data and key != "entry_id":
                Log.warning(f"Removed unsupported kwargs key, {key=}")
                del kwargs[key]

            elif value is None:
                Log.debug(f"Removed kwargs key as it's value was None, {key=}")
                del kwargs[key]

        # check if entry kwargs is missing keys, if so, use default value
        for key, value in default_data.items():
            if key not in kwargs:
                Log.debug("kwargs is missing key, using default, "
                          f"{key=}, {value=}")

        self._parent_database = parent_database

        default_data.update(kwargs)
        self._data = default_data

        Log.debug(f"Initialized DB entry, {self}")

    def __getitem__(self, key):
        try:
            return self._data[key]

        except AttributeError:
            Log.error(f"Attempted to get data before entry's data is set")
            raise

        except KeyError:
            Log.error(f"Unsupported data key, {key=}")
            raise

    def __repr__(self):
        return f"<DB entry '{type(self).__name__}' #{self['entry_id']}>"

    def __setitem__(self, key, value):
        if key == "entry_id":
            Log.error("Key entry_id can't be modified after entry is created, "
                      f"{key=}, {value=}")
            return

        try:
            self._data[key] = value

        except AttributeError:
            Log.error(f"Attempted to update data before entry's data is set")
            raise

        except KeyError:
            Log.error(f"Invalid data key, {key=}")
            raise

        Log.debug(f"Set {key=} to {value=} of entry {self}")
        self.trigger_db_write()

    def delete(self):
        """
        Delete this entry from its parent DB
        """

        Log.debug(f"Deleting entry from DB, {self}")
        self._parent_database.delete_entry(self)
        Log.debug(f"Deleted entry from DB, {self}")

    def get_data_copy(self, filter_values=True) -> Optional[dict]:
        """
        Get a copy of this entry's data (JSON-compatible dict)
        """

        try:
            data_copy = self._data.copy()

        except AttributeError as ex:
            Log.error(f"Attempted to copy data before initialization",
                      ex=ex)
            return

        if filter_values and self.get_keys_to_filter():
            for key in self.get_keys_to_filter():
                data_copy[key] = "<FILTERED>"

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

        return True

    def trigger_db_write(self):
        """
        Tell this entry's db to write to disk, (should be) called when data is
        updated
        """

        self._parent_database.write_to_disk()

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
