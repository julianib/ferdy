"""
All custom exceptions used
"""


# packet handling errors

class PacketHandlingFailed(Exception):
    code = "error.packet.unknown"


class PacketNameUnknown(PacketHandlingFailed):
    code = "error.packet.name.unknown"


# class ContentMissing(PacketHandlingError):
#     code = "error.content.missing"
