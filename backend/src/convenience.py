"""
Convenience file for easy importing
"""

# builtin modules
from datetime import datetime
from typing import Dict, Iterable, List, Union, Optional, Tuple, Set
import math
import os
import random
import sys
import time

# 3rd party modules
import eventlet
from eventlet.green import subprocess  # greenlet friendly
from eventlet.green.Queue import Queue


# import secrets.py, contains sensitive data
try:
    from scary_secrets import *
    SECRETS_IMPORTED = True
except ImportError:
    Log.warning("Could not import secrets.py")
    SECRETS_IMPORTED = False


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
