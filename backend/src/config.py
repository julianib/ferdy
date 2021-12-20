"""
Configuration file
"""

from colorama import Fore, Style

# general
CRASH_RESTART_DELAY = 0  # seconds, falsy to disable
DEBUG_FLASK = False
HOST = "0.0.0.0"
PORT = 1962


# folders, REMOVE leading and trailing /'s!
DATABASES_FOLDER = "databases"
FILES_FOLDER = "files"
AVATARS_FOLDER = "files/avatars"
SONGS_FOLDER = "files/songs"
LOGS_FOLDER = "logs"


# log levels
TEST = 0, "test", Fore.MAGENTA + Style.NORMAL
DEBUG = 1, "debug", Fore.WHITE + Style.DIM
INFO = 2, "info", Fore.GREEN + Style.NORMAL
WARNING = 3, "warning", Fore.YELLOW + Style.NORMAL
ERROR = 4, "error", Fore.RED + Style.NORMAL


# logging
ABBREVIATIONS = ["", "K", "M", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"]
CONSOLE_CUTOFF = 180  # falsy to disable
CONSOLE_LOG_LEVEL = "test"  # falsy to disable
CONSOLE_TIMESTAMP = True
FILE_LOG_LEVEL = "debug"  # falsy to disable
LOG_CONNECTIONS = False
LOG_ENGINEIO = False
LOG_SOCKETIO = False
CONTENT_KEYS_TO_ABBREVIATE = []
SOUND_LEVEL = None  # falsy to disable
TRACEBACK_LIMIT = 5  # falsy to disable
