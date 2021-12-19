"""
Convenience file for easy importing
"""

# builtin modules
from abc import ABC, abstractmethod
from datetime import datetime
import json
import math
import os
import random
import secrets
import sys
import time
from typing import Dict, Iterable, List, Union, Optional, Tuple, Set

# 3rd party modules
import eventlet
from eventlet.green import subprocess  # greenlet friendly
from eventlet.green.Queue import Queue
import google


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
from exceptions import *
from log import Log


# import secrets.py, contains sensitive data
try:
    from scary_secrets import *
    SCARY_SECRETS_IMPORTED = True
except ImportError:
    Log.warning("Could not import scary_secrets.py")
    SCARY_SECRETS_IMPORTED = False


def setup_folders():
    """
    Create missing folders on startup
    """

    Log.debug("Setting up folders")

    # list of folders to create, in specific order
    create_folders = [
        DATABASES_FOLDER,
        FILES_FOLDER,
        AVATARS_FOLDER,
        SONGS_FOLDER,
        LOGS_FOLDER
    ]

    for folder in create_folders:
        if not os.path.exists(folder):
            os.mkdir(folder)
            Log.debug(f"Created folder {folder}")

    # TODO move this to songs db initialization
    # removed_songs_trash = 0
    # for filename in os.listdir(SONGS_FOLDER):
    #     if not filename.endswith(".mp3"):
    #         os.remove(f"{SONGS_FOLDER}/{filename}")
    #         removed_songs_trash += 1
    #
    # if removed_songs_trash:
    #     print(f"Removed {removed_songs_trash} file(s) from songs folder")


def error_content(error: str):
    return {
        "error": error
    }