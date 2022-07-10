"""
Configuration file
"""

from colorama import Fore, Style

# general
CRASH_RESTART_DELAY = 0  # seconds, falsy to disable
FLASK_DEBUG_MODE = False
HOST = "0.0.0.0"
PORT = 1962
HTTPS = False
CERTFILE = "../fullchain.pem"
KEYFILE = "../privkey.pem"
CLIENT_ID = "179923541658-kfl4lp6lgd1nur0pk5vnqsb3d2hg49e6" \
            ".apps.googleusercontent.com"


# application folders, remove leading and trailing slashes
DATABASES_FOLDER = "databases"
FILES_FOLDER = "files"
AVATARS_FOLDER = "files/avatars"
SMOELEN_FOLDER = "files/smoelen"
SONGS_FOLDER = "files/songs"
LOGS_FOLDER = "logs"


# log levels
TEST = 0, "test", Fore.MAGENTA + Style.NORMAL
DEBUG = 1, "debug", Fore.WHITE + Style.DIM
INFO = 2, "info", Fore.GREEN + Style.NORMAL
WARNING = 3, "warn", Fore.YELLOW + Style.NORMAL
ERROR = 4, "error", Fore.RED + Style.BRIGHT


# logging
ABBREVIATIONS = ["", "K", "M", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"]
CONSOLE_CUTOFF = 150  # falsy to disable
CONSOLE_LOG_LEVEL = "test"  # falsy to disable
CONSOLE_TIMESTAMP = True
FILE_LOG_LEVEL = "debug"  # falsy to disable
LOG_CONNECTIONS = False
LOG_ENGINEIO = False
LOG_SOCKETIO = False
CONTENT_KEYS_TO_ABBREVIATE = []
SOUND_LEVEL = None  # falsy to disable
TRACEBACK_LIMIT = None  # falsy to disable
