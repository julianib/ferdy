"""Convenience file for easy imports"""

# builtin modules

from abc import ABC, abstractmethod
import collections
from datetime import datetime
import hashlib
import itertools
import json
import math
import os
import pathlib
import random
import re
import reprlib
import requests  # possibly not greenlet-friendly
import secrets
import shutil
import sys
import time
import traceback
from typing import Dict, Iterable, List, Union, Optional, Tuple, Set
import urllib.parse as urlparse
import uuid
import winsound


# 3rd-party modules

import colorama
from colorama import Fore, Style
import eventlet
from eventlet.green import subprocess  # greenlet-friendly versions of builtin modules
from eventlet.green.Queue import Queue, Empty
import eventlet.wsgi  # delete this import? eventlet is already imported?
import socketio
import isodate
import trello
import youtube_dl  # possibly not greenlet friendly


# log.Log uses this function, causes NameError if defined later
def set_greenlet_name(name: str):
    """Set the name of the greenlet that called this (for logging)"""

    greenlet = eventlet.getcurrent()
    greenlet.__dict__["custom_greenlet_name"] = name


# local modules

from config import *
from exceptions import *
# import formatting  # unused as of now
from log import Log, abbreviate  # shouldn't be a circular import; from x import y shouldn't execute module x


# access private keys (contains sensitive data)
try:
    from top_secret_private_keys import *
    PRIVATE_KEYS_IMPORTED = True
except ImportError:
    Log.warning("Could not import 'top_secret_private_keys.py', functions using private keys won't work!")
    PRIVATE_KEYS_IMPORTED = False


def simulate_intensive_function(seconds):
    """Simulate the time it takes to process input/audio/video/etc."""

    Log.test(f"Simulating intensive function for {seconds} s")
    time.sleep(seconds)
    Log.test(f"Done simulating ({seconds} s)")


def error_packet(description=None) -> dict:
    """Create a default error packet with no useful information whatsoever"""

    return {
        "description": description or DEFAULT_DESCRIPTION
    }


def shlex_quote_windows(s):
    """Custom Windows version of shlex.quote(), replacing single with double quotes.
    Return a shell-escaped version of the string *s*.
    https://superuser.com/q/324278"""

    if not s:
        return "\"\""
    if re.compile(r"[^\w@%+=:,./-]", re.ASCII).search(s) is None:
        return s

    # use DOUBLE quotes, and put DOUBLE quotes into SINGLE quotes
    # the string $'b is then quoted as "$"'"'"b"
    return "\"" + s.replace("\'", "\"\'\"\'\"") + "\""


def getsizeof_recursive(o, custom_handlers=None):
    """Returns the approximate memory footprint an object and all of its contents.

    Automatically finds the contents of the following builtin containers and
    their subclasses:  tuple, list, deque, dict, set and frozenset.
    To search other containers, add handlers to iterate over their contents:

        handlers = {SomeContainerClass: iter,
                    OtherContainerClass: OtherContainerClass.get_elements}

    From: https://github.com/ActiveState/recipe-577504-compute-mem-footprint/blob/master/recipe.py"""

    def dict_handler(d):
        return itertools.chain.from_iterable(d.items())

    all_handlers = {
        tuple: iter,
        list: iter,
        collections.deque: iter,
        dict: dict_handler,
        set: iter,
        frozenset: iter
    }

    if custom_handlers:
        all_handlers.update(custom_handlers)  # user handlers take precedence

    seen = set()  # track which object id's have already been seen
    default_size = sys.getsizeof(0)  # estimate sizeof object without __sizeof__

    def sizeof(o_):
        if id(o_) in seen:  # do not double count the same object
            return 0

        seen.add(id(o_))
        size = sys.getsizeof(o_, default_size)

        for typ, handler in all_handlers.items():
            if isinstance(o_, typ):
                size += sum(map(sizeof, handler(o_)))
                break

        return size

    return sizeof(o)
