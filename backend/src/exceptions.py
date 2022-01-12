"""
Custom exceptions
"""

# packet handling ok

class Ok(Exception):
    pass


# packet handling errors

class PacketHandlingError(Exception):
    error = "error_not_specified"

class EntryFound(PacketHandlingError):
    error = "entry_found"


class EntryMissing(PacketHandlingError):
    error = "entry_missing"


class InvalidJWT(PacketHandlingError):
    error = "invalid_jwt"


class PacketNotImplemented(PacketHandlingError):
    error = "packet_not_implemented"


class ProfileAlreadyOnline(PacketHandlingError):
    error = "profile_already_online"


# unused
# class ProfileNotPendingApproval(PacketHandlingError):
#     error = "profile_not_pending_approval"


class UserAlreadyLoggedIn(PacketHandlingError):
    error = "user_already_logged_in"


class UserNotLoggedIn(PacketHandlingError):
    error = "user_not_logged_in"


class UserUnauthorized(PacketHandlingError):
    error = "user_unauthorized"
