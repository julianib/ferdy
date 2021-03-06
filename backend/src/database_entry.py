from convenience import *


class DatabaseEntry(ABC):
    def __init__(self, parent_database, **kwargs):
        """
        Create a DB entry instance
        """

        Log.debug(f"Initializing DB entry, type='{type(self).__name__}'")

        default_data = self.get_default_data()

        assert parent_database, "'parent_database' missing from init call"
        assert "id" in kwargs, "'id' missing from kwargs"
        assert default_data, "Entry has no default data"
        assert "id" not in default_data, "'id' key not allowed in entry's " \
                                         "default data"

        for key, value in kwargs.copy().items():
            if key not in default_data and key != "id":
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
        return f"<{type(self).__name__} #{self['id']}>"

    def __setitem__(self, key, value):
        assert key != "id", \
            "key 'id' can't be modified after entry is created"

        if not isinstance(value, type(self.get_default_data()[key])):
            raise ValueError(
                "Invalid value type, must be same as default type")

        try:
            self._data[key] = value

        except AttributeError:
            Log.error(f"Attempted to update data before entry's data is set")
            raise

        except KeyError:  # can this even occur during setitem?
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

    def get_data_copy(self, filter_values=True) -> dict:
        """
        Get a copy of this entry's data (JSON-compatible dict)
        """

        try:
            data_copy = self._data.copy()

        except AttributeError:
            Log.error(f"Attempted to copy data before initialization")
            raise

        if filter_values and self.get_keys_to_filter():
            for key in self.get_keys_to_filter():
                data_copy[key] = "<FILTERED>"

        return data_copy

    def matches_kwargs(self, **kwargs) -> bool:
        for key, value in kwargs.items():
            # check if we're dealing with a string
            if type(self[key]) == type(value) == str:
                if self[key].lower() != value.lower():
                    return False

            else:
                if self[key] != value:
                    return False

        Log.debug(f"Entry match: {self}")
        return True

    def trigger_db_write(self):
        """
        Tell this entry's db to write to disk, (should be) called when data is
        updated by
        """

        self._parent_database.write_to_disk()

    @staticmethod
    @abstractmethod
    def get_default_data() -> dict:
        # todo add REQUIRED properties: ("key": None), such as "name" for Roles
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
