"""
Custom exceptions
"""

# packet handling errors

class BasePacketError(Exception):
    error = "error_not_specified"


class EntryFound(BasePacketError):
    error = "entry_found"


class EntryMissing(BasePacketError):
    error = "entry_missing"


class InvalidContent(BasePacketError):
    error = "invalid_content"


class InvalidJWT(BasePacketError):
    error = "invalid_jwt"


class PacketNotImplemented(BasePacketError):
    error = "packet_not_implemented"


class ProfileAlreadyOnline(BasePacketError):
    error = "profile_already_online"


class UserAlreadyLoggedIn(BasePacketError):
    error = "user_already_logged_in"


class UserNotLoggedIn(BasePacketError):
    error = "user_not_logged_in"


class UserUnauthorized(BasePacketError):
    error = "user_unauthorized"
