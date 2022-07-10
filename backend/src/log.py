from convenience import *

import colorama
from colorama import Style

import traceback


# init colorama
colorama.init(autoreset=True)


def get_level_int_from_str(level_str: str) -> int:
    """
    Convert a log level string to its actual level int
    """

    for level in [TEST, DEBUG, INFO, WARNING, ERROR]:
        if level[1] == level_str:
            return level[0]

    raise ValueError(f"Unknown log level, {level_str=}")


def filter_content(content, abbreviate_keys=True) \
        -> Optional[Union[dict, list]]:
    """
    Recursively abbreviate values in packets
    """

    if not content:
        return content

    content_copy = content.copy()
    content_type = type(content)

    if content_type == list:
        return [
            filter_content(element, abbreviate_keys)
            for element in content_copy
        ]

    if content_type == dict:
        for key in content_copy:
            if abbreviate_keys and key in CONTENT_KEYS_TO_ABBREVIATE:
                content_copy[key] = abbreviate(content_copy[key])

        return content_copy

    raise ValueError(f"Unsupported packet content to abbreviate, "
                     f"{content_type=}")


# TODO test on negative numbers, also in frontend JS version
def abbreviate(number: int) -> str:
    """
    Return a human-readable string of the given number (supports [0, 1e32]).
    Should usually just be done by the frontend.
    """

    try:
        number = int(number)
    except ValueError:
        Log.warning(f"Failed to abbreviate, {number=}")
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


# TODO implement sounds
class Log:
    FILE_WRITING_QUEUE = Queue()
    WRITE_FILE_LOOP_CALLED = False

    @staticmethod
    def test(raw_message, **kwargs):
        kwargs.pop("cutoff", None)
        Log._log(raw_message, TEST, cutoff=False, **kwargs)

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
    def _log(raw_message, level, **kwargs):
        """
        Internal logging function, use Log.info etc for proper logging
        """

        # print an exception and traceback
        ex: Exception = kwargs.pop("ex", None)

        # hide values in packet content if present and necessary
        content = kwargs.pop("content", None)
        if content and content != "<NO CONTENT GIVEN>":
            # if packet contained content, filter certain keys
            content = filter_content(content)

        # skip cutting off the message if its too long
        cutoff: bool = kwargs.pop("cutoff", True)

        # get sound related kwargs
        # skip_sound: bool = kwargs.pop("skip_sound", False)
        # force_sound: bool = kwargs.pop("force_sound", False)

        # get the current greenlet's name
        greenlet_name: str = get_greenlet_name()

        raw_message = str(raw_message)

        # if a packet is given, add it to the outputted message
        if content is not None:
            raw_message += f"\n\t{content=}"

        # check if sufficient log level before logging
        if CONSOLE_LOG_LEVEL and \
                level[0] >= get_level_int_from_str(CONSOLE_LOG_LEVEL):

            excess_message_size = len(raw_message) - CONSOLE_CUTOFF
            if CONSOLE_CUTOFF and cutoff and excess_message_size > 0:
                message = raw_message[:CONSOLE_CUTOFF] + \
                    f"... (+ {excess_message_size})"
            else:
                message = raw_message

            # no need for a lock, https://stackoverflow.com/a/2854703/13216113
            color = level[2]
            level_text = level[1].upper()

            # only log timestamp in console if it's enabled
            if CONSOLE_TIMESTAMP:
                now = datetime.now().strftime("%H:%M:%S.%f")[:-3]
                print(
                    f"{color}[{now}][{level_text.ljust(5)}][{greenlet_name}] "
                    f"{Style.RESET_ALL}{message}"
                )
            else:
                print(
                    f"{color}[{level_text.ljust(5)}][{greenlet_name}] "
                    f"{Style.RESET_ALL}{message}"
                )

            if ex:
                traceback.print_exception(
                    type(ex), ex, ex.__traceback__, file=sys.stdout,
                    limit=TRACEBACK_LIMIT
                )

        # write raw message and exception to file if enabled
        if FILE_LOG_LEVEL and \
                level[0] >= get_level_int_from_str(FILE_LOG_LEVEL):

            now = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")[:-3]
            Log.FILE_WRITING_QUEUE.put(
                (now, level, greenlet_name, raw_message, ex, content))

        # play sound if adequate level
        # if SOUND_LEVEL and not skip_sound and \
        #         (level[0] >= SOUND_LEVEL or force_sound):
        #
        #     try:
        #         # winsound.MessageBeep(-1)
        #         pass
        #     except Exception as ex:
        #         Log.error(
        #             "Unhandled exception on playing logging sound",
        #             ex=ex, skip_sound=True
        #         )

    @staticmethod
    def log_writer_loop():
        """
        Blocking loop to write messages and exceptions to file from the queue
        """

        set_greenlet_name("LogWriter")

        if not FILE_LOG_LEVEL:
            Log.debug("File logging disabled")

        if Log.WRITE_FILE_LOOP_CALLED:
            Log.warning("write_file_loop() was already called, ignoring")
            return

        Log.WRITE_FILE_LOOP_CALLED = True

        # set and clear the latest log
        latest_log = f"{LOGS_FOLDER}/.latest.txt"
        Log.debug(f"Emptying latest log: {latest_log}")
        open(latest_log, "w").close()

        Log.debug("Log writer loop ready")

        while True:
            now_str, level, thread_name, message, ex, \
                content = Log.FILE_WRITING_QUEUE.get()

            if content is not None:
                message += f"\n\t{content=}"

            with open(latest_log, "a", encoding="utf-8") as f:
                f.write(
                    f"[{now_str}][{level[1].upper().ljust(5)}][{thread_name}] "
                    f"{message}\n"
                )

                if ex:
                    traceback.print_exception(
                        type(ex), ex, ex.__traceback__, file=f,
                        limit=TRACEBACK_LIMIT
                    )
