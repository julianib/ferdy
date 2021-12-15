"""
Configuration file
"""

# general
CRASH_RESTART_DELAY = 2  # seconds
DEBUG = False
HOST = "0.0.0.0"
PORT = 1962


# folders
DATABASES_FOLDER = "databases"
FILES_FOLDER = "files"
AVATARS_FOLDER = "files/avatars"
SONGS_FOLDER = "files/songs"
LOGS_FOLDER = "logs"


# logging
ABBREVIATIONS = ["", "K", "M", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"]
CONSOLE_CUTOFF = 400
CONSOLE_LOG_LEVEL = "trace"  # None to disable
FILE_LOG_LEVEL = "trace"  # None to disable
LOG_CONNECTIONS = False
LOG_ENGINEIO = False
LOG_SOCKETIO = False
PACKET_KEYS_TO_ABBREVIATE = []
PACKET_KEYS_TO_HIDE = []
SOUND_LEVEL = None  # None to disable
TRACEBACK_LIMIT = None
