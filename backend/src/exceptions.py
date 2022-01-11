"""
Custom exceptions
"""

# packet handling ok

class Ok(Exception):
    pass


# packet handling errors

class PacketHandlingError(Exception):
    error = "error_not_specified"


class AlreadyLoggedIn(PacketHandlingError):
    error = "already_logged_in"


class EntryMissing(PacketHandlingError):
    error = "entry_missing"


class EntryFound(PacketHandlingError):
    error = "entry_found"


class JWTInvalid(PacketHandlingError):
    error = "jwt_invalid"


class NotLoggedIn(PacketHandlingError):
    error = "not_logged_in"


class PacketNotImplemented(PacketHandlingError):
    error = "packet_not_implemented"


class Unauthorized(PacketHandlingError):
    error = "unauthorized"
