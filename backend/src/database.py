from convenience import *
from database_entry import DatabaseEntry


class Database(ABC):
    def __init__(self, entry_class, filename: str):
        """
        Abstract class representing a db that can be saved as a json file
        """

        Log.debug("Initializing db")

        self._entries: List[entry_class] = []
        self._entry_class = entry_class
        self._filename: str = filename
        self._file_path: str = f"{DATABASES_FOLDER}/{filename}"
        self._last_entry_id: int = 0
        self._has_read_from_file: bool = False

        self._read_from_disk()

        Log.debug(f"Initialized db: {self}")
        # TODO calc and print MB used
        # TODO compare size in memory with size on disk

    def __repr__(self):
        entries_count = self.get_entries_count()
        return f"<DB '{type(self).__name__}', {entries_count=}>"

    def _get_next_entry_id(self) -> int:
        self._last_entry_id += 1
        Log.debug(f"Next db entry id: {self._last_entry_id}")
        return self._last_entry_id

    def _read_from_disk(self):
        """
        Read from disk, only called on startup
        """

        if self._has_read_from_file:
            Log.warning(f"{self} already read from disk, ignoring call")
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
            data = json.load(f)
            self._last_entry_id = data.get("last_entry_id", 0)
            entries_data = data.get("entries_data", [])

        file_entries_missing_keys = 0
        for entry_data in entries_data:
            entry = self.initialize_new_entry(from_disk=True, **entry_data)
            if entry.disk_was_missing_keys:
                file_entries_missing_keys += 1

        if file_entries_missing_keys:
            Log.debug(f"{file_entries_missing_keys} entries were missing keys, "
                      "writing to disk")
            self.write_to_disk()

        # prevent reading twice (could cause data loss)
        self._has_read_from_file = True

        Log.debug(f"{self} read from disk")

    def delete_entry(self, entry):
        if entry not in self._entries:
            raise ValueError("Entry is not in db")

        self._entries.remove(entry)
        self.write_to_disk()

    def initialize_new_entry(self, from_disk=False, **kwargs):
        """
        Create a db entry for this db. Kwargs will overwrite the entry
        type's default data. Returns the created entry.
        """

        Log.debug(f"Starting initialization of new entry for {self}")

        if "entry_id" in kwargs:
            if not from_disk:
                raise ValueError("entry_id not allowed in kwargs if creating "
                                 "during runtime")
        else:
            kwargs["entry_id"] = self._get_next_entry_id()

        # check if entry was missing keys (outdated) if read from disk
        disk_was_missing_keys = False
        if from_disk:
            default_data = self._entry_class.get_default_data()
            for key, value in default_data.items():
                if key not in kwargs:
                    entry_id = kwargs["entry_id"]
                    Log.debug(f"Entry on disk was missing key, set default, "
                              f"{entry_id=}, {key=}")
                    disk_was_missing_keys = True

        # actually init the entry object
        new_entry = self._entry_class(
            in_database=self, disk_was_missing_keys=disk_was_missing_keys,
            **kwargs
        )
        self._entries.append(new_entry)

        # if created during runtime, update db on disk
        if not from_disk:
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

    def match_many(self, raise_no_match=False, match_casing=False, **kwargs) \
            -> List[DatabaseEntry]:

        Log.debug(f"Matching entries with kwargs, {kwargs=}, {match_casing=}")

        if not kwargs:
            raise ValueError("No kwargs given")

        matches = []
        for entry in self.get_entries_copy():
            if entry.matches_kwargs(match_casing, **kwargs):
                matches.append(entry)

        if matches:
            Log.debug(f"{len(matches)} match(es) found")
            return matches
        elif raise_no_match:
            raise NoEntriesMatch
        else:
            Log.debug("No entries match")
            return []

    def match_single(self, raise_no_match=False, match_casing=False, **kwargs) \
            -> DatabaseEntry:

        Log.debug(f"Matching entry with kwargs, {kwargs=}, {match_casing=}")

        if not kwargs:
            raise ValueError("No kwargs given")

        for entry in self.get_entries_copy():
            if entry.matches_kwargs(match_casing, **kwargs):
                return entry

        if raise_no_match:
            raise NoEntriesMatch
        else:
            Log.debug("No entries match")

    # def remove_entry(self, entry):
    # TODO implement removing entries from db

    def write_to_disk(self):
        entries_data = self.get_entries_data_copy(
            filter_values=False, key=lambda entry: entry["entry_id"]
        )

        to_dump = {
            "last_entry_id": self._last_entry_id,
            "entries_data": entries_data,
        }

        with open(self._file_path, "w") as f:
            json.dump(to_dump, f, indent=2, sort_keys=True)
