from convenience import *


colorama.init(autoreset=False)


class LogLevel:
    TRACE = 0, "trace", ""
    DEBUG = 1, "debug", Fore.CYAN
    INFO = 2, "info", Fore.GREEN + Style.BRIGHT
    WARNING = 3, "warning", Fore.YELLOW
    ERROR = 4, "error", Fore.RED
    CRITICAL = 5, "critical", Fore.RED + Style.BRIGHT
    TEST = 6, "test", Fore.MAGENTA

    @staticmethod
    def get_level_int_from_str(level_str: str):
        for level in [LogLevel.TRACE, LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARNING,
                      LogLevel.ERROR, LogLevel.CRITICAL, LogLevel.TEST]:
            if level[1] == level_str:
                return level[0]

        raise ValueError(f"Unknown level string provided: {level_str}")


class Log:
    FILE_WRITING_QUEUE = Queue()  # now_str, level, thread_name, ex, message, packet

    @staticmethod
    def trace(message, **kwargs):
        Log._log(message, LogLevel.TRACE, **kwargs)

    @staticmethod
    def debug(message, **kwargs):
        Log._log(message, LogLevel.DEBUG, **kwargs)

    @staticmethod
    def info(message, **kwargs):
        Log._log(message, LogLevel.INFO, **kwargs)

    @staticmethod
    def warning(message, **kwargs):
        Log._log(message, LogLevel.WARNING, **kwargs)

    @staticmethod
    def error(message, **kwargs):
        Log._log(message, LogLevel.ERROR, **kwargs)

    @staticmethod
    def critical(message, **kwargs):
        Log._log(message, LogLevel.CRITICAL, **kwargs)

    @staticmethod
    def test(message, **kwargs):
        Log._log(message, LogLevel.TEST, **kwargs)

    @staticmethod
    def _log(raw_message, level, **kwargs):
        ex: Exception = kwargs.pop("ex", None)  # print an exception and traceback
        packet = hide_packet_values_for_logging(kwargs.pop("packet", None))  # pretty print a packet
        cutoff: bool = kwargs.pop("cutoff", True)  # skip cutting off the message if its too long
        skip_sound: bool = kwargs.pop("skip_sound", False)  # skip making a sound
        raw_message = str(raw_message)

        if packet is not None:
            raw_message += f"\n packet: {packet}"

        try:
            # dirty way of setting/getting GreenThread names, as threading.current_thread().getName() doesn't works for greenlets
            greenlet_name = eventlet.getcurrent().__dict__["custom_greenlet_name"]
        except KeyError:
            # in case the greenlet doesn't have a name set, always provides a value
            greenlet_name = "NAMELESS GREENLET"

        if level[0] >= LogLevel.get_level_int_from_str(CONSOLE_LOGGING_LEVEL):  # check log level for console logging
            now_console = datetime.now().strftime("%H:%M:%S")

            excess_message_size = len(raw_message) - CONSOLE_LOGGING_LENGTH_CUTOFF
            if excess_message_size > 0 and cutoff:
                message = raw_message[:CONSOLE_LOGGING_LENGTH_CUTOFF] + f"... (+ {excess_message_size})"
            else:
                message = raw_message

            # Greenthreads don't require locks, so this is fine (https://stackoverflow.com/a/2854703/13216113)
            print(f"{level[2]}[{now_console}][{level[1].upper()}][{greenlet_name}]{Style.RESET_ALL} {message}")
            if ex:
                traceback.print_exception(type(ex), ex, ex.__traceback__, file=sys.stdout, limit=TRACEBACK_LIMIT)

        if ENABLE_FILE_LOGGING and level[0] >= LogLevel.get_level_int_from_str(FILE_LOGGING_LEVEL):  # write raw message (and exception) to file if enabled
            now_file = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            Log.FILE_WRITING_QUEUE.put((now_file, level, greenlet_name, raw_message, ex, packet))

        if "-sounds" in sys.argv and level[1] in SOUND_NOTIFICATION_LOG_LEVELS and not skip_sound:
            try:
                winsound.MessageBeep(-1)
            except Exception as ex:
                Log.trace("Unhandled exception on winsound", ex=ex, skip_sound=True)

    @staticmethod
    def write_file_loop():
        """Blocking loop to write messages and exceptions to file from the queue"""

        set_greenlet_name("LogFileWriter")
        latest_log_abs = f"{LOGS_FOLDER}/{LATEST_LOG_FILENAME}"

        Log.trace("Write log file loop ready")

        while True:
            now_str, level, thread_name, message, ex, packet = Log.FILE_WRITING_QUEUE.get()
            if packet is not None:
                message += f"\n packet: {packet}"

            with open(latest_log_abs, "a", encoding="utf-8") as f:
                f.write(f"[{now_str}][{level[1].upper()}][{thread_name}] {message}\n")
                if ex:
                    traceback.print_exception(type(ex), ex, ex.__traceback__, file=f, limit=TRACEBACK_LIMIT)


def hide_packet_values_for_logging(packet: Union[dict, list]) -> Optional[Union[dict, list]]:
    """Recursively hide values in packet containing useless info (like entire files) from being logged"""

    if not packet:
        return packet

    packet_copy = packet.copy()

    if type(packet) == list:
        return [hide_packet_values_for_logging(element) for element in packet_copy]

    if type(packet) == dict:
        for key in packet_copy:
            if key in HIDE_PACKET_KEYS:
                packet_copy[key] = "<hidden>"
            elif key in ABBREVIATE_NUMBER_KEYS:
                packet_copy[key] = abbreviate(packet_copy[key])

        return packet_copy

    raise ValueError(f"Unsupported type: {type(packet).__name__}")


abbreviations = ["", "K", "M", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"]


def abbreviate(number: int) -> str:
    """
    Return a human-readable string of the given number. Supported range: [0, 1e32]
    Should usually just be done by the frontend, saves a lot of packets
    """
    
    # TODO test on negative numbers, also in frontend JS version

    try:
        number = int(number)
    except ValueError:
        return "<NaN>"

    if number == 0:
        return "<0>"

    magnitude = int(math.floor((math.log10(number))))

    if magnitude < 3:  # number too small
        return str(number)

    new_number = number / 10 ** magnitude

    if new_number >= 9.995:  # possible carry-over that turns rounding into n >= 10 instead of [1, 9.99]
        magnitude += 1
        new_number /= 10

    magnitude_remainder = magnitude % 3
    decimals = None if (magnitude_remainder == 2 or magnitude < 3) else 2 - magnitude_remainder  # what
    new_number *= 10 ** magnitude_remainder
    new_number = round(new_number, decimals)

    abbreviation_index = int(magnitude / 3)
    abbreviation = abbreviations[abbreviation_index]
    abbreviated_number = str(new_number) + abbreviation

    # Log.test(f"Abbreviated {number} to {abbreviated_number}")
    return f"<{abbreviated_number}>"
