# Time is in seconds not ms

# SocketIO settings
HOST = "0.0.0.0"
PORT = 777
MAX_MODEL_BYTES = 1e3
MAX_PACKET_BYTES = 1e6


# Startup
STARTUP_CLEANUP_BACKEND_CACHE = True
DELAY_BEFORE_RESTART = 60


# What to log
LOG_SOCKETIO = True
LOG_ENGINEIO = True
LOG_WSGI = True
LOG_YOUTUBE_DL_VERBOSE = False
LOG_YOUTUBE_DL_WARNINGS = False
# [quiet, panic, critical, error, warning, info, verbose, debug, trace]
FFMPEG_LOGGING_LEVEL = "warning"
HIDE_PACKET_KEYS: list = ["avatar_bytes", "password", "song_bytes"]
ABBREVIATE_NUMBER_KEYS: list = ["money"]
TRACEBACK_LIMIT = 20


# Console logging
CONSOLE_LOGGING_LEVEL = "trace"
CONSOLE_LOGGING_LENGTH_CUTOFF = 400


# File logging
LOGS_FOLDER = "logs"
LATEST_LOG_FILENAME = ".latest.txt"
ENABLE_FILE_LOGGING = True
FILE_LOGGING_LEVEL = "info"


# Sound notifications, enable with -sounds
SOUND_NOTIFICATION_LOG_LEVELS: list = ["warning", "error", "critical"]


# Data storage
FILES_FOLDER = "files"
DATABASES_FOLDER = "databases"
SONGS_FOLDER = "songs"
AVATARS_FOLDER = "avatars"
AVATAR_MIME_EXTENSIONS: dict = {
    "image/jpeg": "jpg",
    "image/png": "png"
}


# Songs
POPULAR_SONGS_RATIO_MIN = 0.5
SONG_MAX_DURATION = 1200
# LOG_IN_TO_REQUEST_SONG = True TODO implement
YOUTUBE_ID_CHARACTERS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_"
YOUTUBE_ID_LENGTH = 11
YOUTUBE_ID_REGEX_PATTERN = r"(https?://)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)/(watch\?v=|embed/|v/|.+\?v=)?(?P<id>[A-Za-z0-9\-=_]{11})"


# Trello
TRELLO_BOARD_ID = "603c469a39b5466c51c3a176"
TRELLO_LIST_ID = "60587b1f02721f0c7b547f5b"


# Accounst
USERNAME_VALID_CHARACTERS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
USERNAME_MAX_LENGTH = 16
USERNAME_MIN_LENGTH = 1
RANDOM_MONEY_MIN = 1e3
RANDOM_MONEY_MAX = 1e6


# User pinging (checking latency)
PING_USERS_ENABLED = False
PING_USERS_INTERVAL = 5
PONG_DELAY_BEFORE_TIMEOUT = 5  # TODO fix: timeout < interval should be possible
