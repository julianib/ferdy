"""
Convenience file for easy importing
"""

# builtin modules
from datetime import datetime
from typing import Dict, Iterable, List, Union, Optional, Tuple, Set
import math
import os
import random
import secrets
import sys
import time

# 3rd party modules
import eventlet
from eventlet.green import subprocess  # greenlet friendly
from eventlet.green.Queue import Queue
import google


# import secrets.py, contains sensitive data
try:
    from scary_secrets import *
    SCARY_SECRETS_IMPORTED = True
except ImportError:
    Log.warning("Could not import scary_secrets.py")
    SCARY_SECRETS_IMPORTED = False


# log.Log uses this function, so define it before importing
def set_greenlet_name(name: str):  # nopep8
    """
    Set the name of the greenlet that called this function. This is pretty
    dirty (current_thread.getName isn't for greenlets).
    """

    eventlet.getcurrent().__dict__["_greenlet_name"] = name


def get_greenlet_name() -> str:  # nopep8
    """
    Get the current greenlet's name
    """

    try:
        return eventlet.getcurrent().__dict__["_greenlet_name"]
    except:
        # just in case if the greenlet has no name set (shouldn't happen)
        return "NAMELESS"


# project modules
from config import *
from log import Log


def setup_files_and_folders():
    """
    Create and setup (missing) folders and files on startup
    """

    print("Setting up files and folders")

    # list of folders to create, in specific order
    create_folders = [
        DATABASES_FOLDER,
        FILES_FOLDER,
        AVATARS_FOLDER,
        SONGS_FOLDER,
        LOGS_FOLDER
    ]

    # create files after folders
    create_files = [
        f"{DATABASES_FOLDER}/accounts.json",
        f"{DATABASES_FOLDER}/songs.json",
        f"{LOGS_FOLDER}/.latest.txt"
    ]

    for folder in create_folders:
        if not os.path.exists(folder):
            os.mkdir(folder)
            print(f"Created folder {folder}")

    for file in create_files:
        if not os.path.exists(file):
            if file.endswith(".json"):
                # empty json files contain curly braces
                with open(file, "w") as f:
                    f.write("{}")

            else:
                open(file, "w").close()

            print(f"Created file {file}")

    if FILE_LOG_LEVEL:
        open(f"{LOGS_FOLDER}/.latest.txt", "w").close()
        print(f"Emptied latest log")

    removed_songs_trash = 0
    for filename in os.listdir(SONGS_FOLDER):
        if not filename.endswith(".mp3"):
            os.remove(f"{SONGS_FOLDER}/{filename}")
            removed_songs_trash += 1

    if removed_songs_trash:
        print(f"Removed {removed_songs_trash} trash file(s) from songs folder")

