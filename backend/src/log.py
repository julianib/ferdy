from convenience import *

import colorama
from colorama import Fore, Style

import traceback


# init colorama
colorama.init(autoreset=True)

# define log levels
TRACE = 0, "trace", ""
DEBUG = 1, "debug", Fore.CYAN
INFO = 2, "info", Fore.GREEN + Style.BRIGHT
WARNING = 3, "warning", Fore.YELLOW
ERROR = 4, "error", Fore.RED
CRITICAL = 5, "critical", Fore.RED + Style.BRIGHT
TEST = 6, "test", Fore.MAGENTA


def get_level_int_from_str(level_str: str):
    """
    Convert a log level string to its actual level int
    """

    for level in [TRACE, DEBUG, INFO, WARNING, ERROR, CRITICAL, TEST]:
        if level[1] == level_str:
            return level[0]

    raise ValueError(f"Unknown log level: {level_str=}")


def hide_packet_values(packet: Union[dict, list]) -> Optional[Union[dict, list]]:
    """
    Recursively hide values in packet containing sensitive or unimportant data 
    from being logged
    """

    if not packet:
        return packet

    packet_copy = packet.copy()
    packet_type = type(packet)

    if packet_type == list:
        return [hide_packet_values(element) for element in packet_copy]

    if packet_type == dict:
        for key in packet_copy:
            if key in PACKET_KEYS_TO_HIDE:
                packet_copy[key] = "<hidden>"
            elif key in PACKET_KEYS_TO_ABBREVIATE:
                packet_copy[key] = abbreviate(packet_copy[key])

        return packet_copy

    raise ValueError(f"Unsupported packet to hide, {packet_type=}")


def abbreviate(number: int) -> str:
    """
    Return a human-readable string of the given number (supports [0, 1e32]).
    Should usually just be done by the frontend.
    TODO test on negative numbers, also in frontend JS version
    """

    try:
        number = int(number)
    except ValueError:
        Log.warn(f"Failed to abbreviate: {number=}")
        return "NaN"

    if number == 0:
        return "0"

    magnitude = int(math.floor((math.log10(number))))

    if magnitude < 3:  # number too small to abbreviate
        return str(number)

    new_number = number / 10 ** magnitude

    # prevent abbreviated number to be >= 10 instead of in [1, 9.99]
    if new_number >= 9.995:
        magnitude += 1
        new_number /= 10

    # get the amount of decimals in the abbreviated number
    magnitude_remainder = magnitude % 3
    if magnitude < 3 or magnitude_remainder == 2:
        decimals = None
    else:
        decimals = 2 - magnitude_remainder

    # multiply by the correct magnitude and round to the final number
    new_number *= 10 ** magnitude_remainder
    new_number = str(round(new_number, decimals))

    # add the correct abbreviation
    abbreviation_index = magnitude // 3
    abbreviation = ABBREVIATIONS[abbreviation_index]
    abbreviated_number = new_number + abbreviation

    return abbreviated_number


class Log:
    FILE_WRITING_QUEUE = Queue()
    WRITE_FILE_LOOP_CALLED = False

    @staticmethod
    def trace(raw_message, **kwargs):
        Log._log(raw_message, TRACE, **kwargs)

    @staticmethod
    def debug(raw_message, **kwargs):
        Log._log(raw_message, DEBUG, **kwargs)

    @staticmethod
    def info(raw_message, **kwargs):
        Log._log(raw_message, INFO, **kwargs)

    @staticmethod
    def warning(raw_message, **kwargs):
        Log._log(raw_message, WARNING, **kwargs)

    @staticmethod
    def error(raw_message, **kwargs):
        Log._log(raw_message, ERROR, **kwargs)

    @staticmethod
    def critical(raw_message, **kwargs):
        Log._log(raw_message, CRITICAL, **kwargs)

    @staticmethod
    def test(raw_message, **kwargs):
        Log._log(raw_message, TEST, **kwargs)

    @staticmethod
    def _log(raw_message, level, **kwargs):
        """
        Internal logging function, don't use this
        """

        # print an exception and traceback
        ex: Exception = kwargs.pop("ex", None)

        # hide values in packet if present and necessary
        packet = hide_packet_values(kwargs.pop("packet", None))

        # skip cutting off the message if its too long
        cutoff: bool = kwargs.pop("cutoff", True)

        # get sound related kwargs
        skip_sound: bool = kwargs.pop("skip_sound", False)
        force_sound: bool = kwargs.pop("force_sound", False)

        # get the current greenlet's name
        greenlet_name: str = get_greenlet_name()

        raw_message = str(raw_message)

        # if a packet is provided, add it to the outputted message
        if packet is not None:
            raw_message += f"\n packet: {packet}"

        # check if sufficient log level before logging
        if CONSOLE_LOG_LEVEL and level[0] >= get_level_int_from_str(CONSOLE_LOG_LEVEL):

            excess_message_size = len(raw_message) - CONSOLE_CUTOFF
            if cutoff and excess_message_size > 0:
                message = raw_message[:CONSOLE_CUTOFF] + \
                    f"... (+ {excess_message_size})"
            else:
                message = raw_message

            # no need for a lock (https://stackoverflow.com/a/2854703/13216113)
            color = level[2]
            level_text = level[1].upper()
            now = datetime.now().strftime("%H:%M:%S")
            print(
                f"{color}[{now}][{level_text}][{greenlet_name}] "
                f"{Style.RESET_ALL}{message}"
            )

            if ex:
                traceback.print_exception(
                    type(ex), ex, ex.__traceback__, file=sys.stdout,
                    limit=TRACEBACK_LIMIT
                )

        # write raw message and exception to file if enabled
        if FILE_LOG_LEVEL and level[0] >= get_level_int_from_str(FILE_LOG_LEVEL):
            now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            Log.FILE_WRITING_QUEUE.put(
                (now, level, greenlet_name, raw_message, ex, packet))

        # play sound if adequate level
        if SOUND_LEVEL and not skip_sound and \
                (level[0] >= SOUND_LEVEL or force_sound):
            try:
                # winsound.MessageBeep(-1)  # TODO implement sounds
                pass
            except Exception as ex:
                Log.trace(
                    "Unhandled exception on playing sound",
                    ex=ex, skip_sound=True
                )

    @staticmethod
    def log_writer_loop():
        """
        Blocking loop to write messages and exceptions to file from the queue
        """

        if Log.WRITE_FILE_LOOP_CALLED:
            Log.warning("write_file_loop() was already called, ignoring")
            return

        Log.WRITE_FILE_LOOP_CALLED = True
        set_greenlet_name("LogWriter")
        latest_log_abs = f"{LOGS_FOLDER}/.latest.txt"

        Log.trace("Log writer loop ready")

        while True:
            now_str, level, thread_name, message, ex, packet = Log.FILE_WRITING_QUEUE.get()
            if packet is not None:
                message += f"\n packet: {packet}"

            with open(latest_log_abs, "a", encoding="utf-8") as f:
                f.write(
                    f"[{now_str}][{level[1].upper()}][{thread_name}] {message}\n")
                if ex:
                    traceback.print_exception(
                        type(ex), ex, ex.__traceback__, file=f, limit=TRACEBACK_LIMIT)
