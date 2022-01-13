from convenience import *
from database_entry import DatabaseEntry


class Database(ABC):
    # TODO calc and print MB used
    # TODO compare size in memory with size on disk
    def __init__(self, entry_class, filename: str):
        """
        Abstract class representing a db that can be saved as a json file
        """

        Log.debug(f"Initializing DB, type='{type(self).__name__}'")

        self._entries: List[entry_class] = []
        self._entry_class: entry_class = entry_class
        self._file_path: str = f"{DATABASES_FOLDER}/{filename}"
        self._next_entry_id: int = 1
        self._has_read_from_file: bool = False

        self._read_from_disk()

        Log.debug(f"Initialized DB: {self}")

    def __repr__(self):
        entries_count = self.get_entries_count()
        return f"<DB '{type(self).__name__}', {entries_count=}>"

    def _get_next_entry_id(self) -> int:
        old = self._next_entry_id
        Log.debug(f"Next DB entry ID: {old}")
        self._next_entry_id += 1
        return old

    def _read_from_disk(self):
        """
        Read from disk, only called on startup
        """

        Log.debug(f"DB reading from disk: {self}")

        if self._has_read_from_file:
            Log.warning(f"DB already read from disk, ignoring call: {self}")
            return

        # create db json file if it doesn't exist and no need to read it
        if not os.path.exists(self._file_path):
            with open(self._file_path, "w") as f:
                f.write("{}")

            # no need to read the disk anymore
            self._has_read_from_file = True

            print(f"Created empty db {self._file_path}, not reading")
            return

        with open(self._file_path, "r") as f:
            db = json.load(f)

            # read, and if newly created db
            self._next_entry_id = db.get("next_entry_id", 1)
            entries_data = db.get("data", [])

        for entry_data in entries_data:
            self.initialize_new_entry(from_disk=True, **entry_data)

        # prevent reading twice (could cause data loss)
        self._has_read_from_file = True

        Log.debug(f"DB read from disk: {self}")

    def delete_entry(self, entry):
        assert entry in self._entries, "entry is not in DB"
        self._entries.remove(entry)
        self.write_to_disk()

    def initialize_new_entry(self, from_disk=False, **kwargs):
        """
        Create a db entry for this db. Kwargs will overwrite the entry
        type's default data. Returns the created entry.
        """

        Log.debug(f"Initializing new entry for DB: {self}")

        if "id" in kwargs:
            if not from_disk:
                raise ValueError("'id' is only allowed in kwargs if reading "
                                 "from disk")
        else:
            kwargs["id"] = self._get_next_entry_id()

        if "parent_database" in kwargs:
            raise ValueError("parent_database not allowed in kwargs")

        # actually init the entry object
        new_entry = self._entry_class(parent_database=self, **kwargs)
        self._entries.append(new_entry)

        # update db on disk in case data was missing/outdated
        self.write_to_disk()

        return new_entry

    def get_entries_copy(self, key=None, reverse=False) -> List[DatabaseEntry]:
        if key:
            return sorted(self._entries.copy(), key=key, reverse=reverse)

        return self._entries.copy()

    def get_entries_count(self) -> int:
        return len(self.get_entries_copy())

    def get_entries_data_copy(
            self, filter_values=True, key=None, reverse=False) -> List[dict]:

        if key:
            return [entry.get_data_copy(filter_values=filter_values)
                    for entry in self.get_entries_copy(key, reverse)]

        return [entry.get_data_copy(filter_values=filter_values)
                for entry in self.get_entries_copy()]

    # todo optimize: if found and raise_found is True, abort search
    def find_many(self, raise_found=False, raise_missing=False, **kwargs) \
            -> List[DatabaseEntry]:

        Log.debug(f"Finding entries in DB {self}, {raise_found=}, "
                  f"{raise_missing=}, {kwargs=}")

        if not kwargs:
            raise ValueError("No kwargs given")

        matches = []
        for entry in self.get_entries_copy():
            if entry.matches_kwargs(**kwargs):
                matches.append(entry)

        Log.debug(f"Entries found: {len(matches)}")

        if matches:
            if raise_found:
                raise EntryFound

            return matches

        elif raise_missing:
            raise EntryMissing
        else:
            return []

    def find_single(self, raise_found=False, raise_missing=False, **kwargs) \
            -> DatabaseEntry:

        Log.debug(f"Finding entry in DB {self}, {raise_found=}, "
                  f"{raise_missing=}, {kwargs=}")

        if not kwargs:
            raise ValueError("No kwargs given")

        for entry in self.get_entries_copy():
            if entry.matches_kwargs(**kwargs):
                if raise_found:
                    raise EntryFound

                return entry

        if raise_missing:
            raise EntryMissing
        else:
            Log.debug("No entry found")

    def write_to_disk(self):
        entries_data = self.get_entries_data_copy(
            filter_values=False, key=lambda entry: entry["id"]
        )

        to_dump = {
            "data": entries_data,
            "next_entry_id": self._next_entry_id,
        }

        with open(self._file_path, "w") as f:
            json.dump(to_dump, f, indent=2, sort_keys=True)
