from convenience import *
from database_entry import DatabaseEntry


class Database(ABC):
    def __init__(self, entry_class, filename: str):
        """
        Abstract class representing a db that can be saved as a json file
        """

        Log.debug("Initializing db")

        self._entry_class = entry_class
        self._filename: str = filename
        self._file_path: str = f"{DATABASES_FOLDER}/{filename}"
        self._last_entry_id: int = 0
        self._entries: Set[DatabaseEntry] = set()
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
            entries_as_jsonable = data.get("entries", [])

        file_entries_missing_keys = 0  # entries missing keys
        for entry_as_jsonable in entries_as_jsonable:
            entry = self.initialize_entry(from_disk=True, **entry_as_jsonable)
            if entry.disk_was_missing_keys:
                file_entries_missing_keys += 1

        if file_entries_missing_keys:
            Log.debug(f"{file_entries_missing_keys} entries were missing"
                      "keys, updating")
            self.write_to_disk()

        # prevent reading twice (could cause data loss)
        self._has_read_from_file = True

        Log.debug(f"{self} read from disk")

    def initialize_entry(self, from_disk=False, **kwargs) -> DatabaseEntry:
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

            # convert from jsonable types in data to usable types
            kwargs = self._entry_class.convert_jsonable_from_disk(kwargs)

        # init the entry object
        new_entry = self._entry_class(
            in_database=self, disk_was_missing_keys=disk_was_missing_keys,
            **kwargs
        )
        self._entries.add(new_entry)

        # if created during runtime, update db on disk
        if not from_disk:
            self.write_to_disk()

        return new_entry

    def get_entries(self) -> Set[DatabaseEntry]:
        return self._entries.copy()  # TODO is it ok to return a copy?

    def get_entries_count(self) -> int:
        return len(self.get_entries())

    def get_entries_jsonable(self, filter_values=True, key=None, reverse=False) -> List[dict]:
        # TODO this probably can't be a set, should be a list (make sure)

        if key:
            return [entry.get_jsonable(filter_values=filter_values)
                    for entry in self.get_entries_sorted(key, reverse)]

        return [entry.get_jsonable(filter_values=filter_values)
                for entry in self.get_entries()]

    def get_entries_sorted(self, key, reverse=False) -> set:
        return set(sorted(self.get_entries(), key=key, reverse=reverse))

    def match_many(self, raise_no_match=False, match_casing=False, **kwargs):
        Log.debug(f"Matching entries with kwargs, {match_casing=}, {kwargs=}")

        if not kwargs:
            raise ValueError("No kwargs given")

        candidates = set()
        for entry in self.get_entries():
            if entry.matches_kwargs(match_casing, **kwargs):
                candidates.add(entry)

        if candidates:
            return candidates
        elif raise_no_match:
            raise NoEntriesMatch
        else:
            Log.debug("No db entries match kwargs")
            return set()

    def match_single(self, raise_no_match=False, match_casing=False, **kwargs):
        Log.debug(f"Matching entry with kwargs, {match_casing=}, {kwargs=}")

        if not kwargs:
            raise ValueError("No kwargs given")

        for entry in self.get_entries():
            if entry.matches_kwargs(match_casing, **kwargs):
                return entry

        if raise_no_match:
            raise NoEntriesMatch
        else:
            Log.debug("No db entry matches kwargs")

    # def remove_entry(self, entry):
    # TODO implement removing entries from db

    def write_to_disk(self):
        entries_jsonable_sorted = self.get_entries_jsonable(
            filter_values=True, key=lambda entry: entry["entry_id"]
        )

        with open(self._file_path, "w") as f:
            json.dump({
                "last_entry_id": self._last_entry_id,
                "entries": entries_jsonable_sorted
            }, f, indent=2, sort_keys=True)
