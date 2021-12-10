from config import USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH


DEFAULT_DESCRIPTION = "No information provided (not good)"


# packet handling errors

class PacketHandlingFailed(Exception):
    description = DEFAULT_DESCRIPTION


class ActionInvalid(PacketHandlingFailed):
    def __init__(self, description="Action invalid"):
        self.description = description

    def __str__(self):
        return str(self.description)


class DatabaseEntryNotFound(PacketHandlingFailed):
    description = "Database entry not found"


class GameNotSet(PacketHandlingFailed):
    description = "Room has no game set"


class ModelInvalid(PacketHandlingFailed):
    description = "Invalid model"


class NoPrivateKeys(PacketHandlingFailed):
    description = "Backend host has no access to private keys"


class NoSongPlaying(PacketHandlingFailed):
    description = "No song is currently playing"


class NoSongsAvailable(PacketHandlingFailed):
    description = "No songs available"


class PacketMissing(PacketHandlingFailed):
    description = "Model is missing a (required) packet"


class PasswordInvalid(PacketHandlingFailed):
    description = "Invalid password"


class RepeatPasswordInvalid(PacketHandlingFailed):
    description = "Repeated password does not match"


class RoomFull(PacketHandlingFailed):
    description = "Room is full"


class RoomNotFound(PacketHandlingFailed):
    description = "Room not found"


class UserAlreadyInRoom(PacketHandlingFailed):
    description = "Already in a room"


class UserNotInRoom(PacketHandlingFailed):
    description = "Not in a room"


class UserNotLoggedIn(PacketHandlingFailed):
    description = "User not logged in"


class UserUnauthorized(PacketHandlingFailed):
    description = "User unauthorized"


class UsernameSizeInvalid(PacketHandlingFailed):
    description = f"Username must contain {USERNAME_MIN_LENGTH}-{USERNAME_MAX_LENGTH} alphanumeric characters"


class UsernameTaken(PacketHandlingFailed):
    description = "Username taken"


# game start errors

class GameStartFailed(Exception):
    description = DEFAULT_DESCRIPTION


class GameRunning(GameStartFailed):
    description = "Game is already running"


class RoomEmpty(GameStartFailed):
    description = "Room is empty"


# song processing


class SubprocessFailed(Exception):
    def __init__(self, description):
        self.description = str(description)

    def __str__(self):
        return self.description


class ExtractSongInformationFailed(Exception):
    def __init__(self, description):
        self.description = str(description)

    def __str__(self):
        return self.description


# other exceptions

class CommandFailed(Exception):
    def __init__(self, description="Command failed"):
        self.description = description

    def __str__(self):
        return str(self.description)


class GameEventInvalid(Exception):
    def __init__(self, description="Game event invalid"):
        self.description = description

    def __str__(self):
        return str(self.description)
