import eventlet
eventlet.monkey_patch()  # required to patch modules for using threads with socketio

from convenience import *

from shove import Shove
from packet_sender import send_packets_loop
from packet_handler import handle_packets_loop
from user_pinger import ping_users_loop
from log import *

set_greenlet_name("Main")

sio = socketio.Server(
    logger=LOG_SOCKETIO,
    async_mode="eventlet",
    cors_allowed_origins="*",
    engineio_logger=LOG_ENGINEIO
)
shove: Union[Shove, None] = None  # Union -> for editor (pycharm) type hint detection

# time.sleep() should be patched by eventlet.monkey_patch(), no need to use eventlet.sleep()
# -> https://stackoverflow.com/a/25315314/13216113


# SocketIO handlers

@sio.on("connect")
def on_connect(sid: str, environ: dict):
    set_greenlet_name("SIO/connect")
    Log.trace(f"Handling connect of SID '{sid}', environ: {environ}")
    user = shove.on_connect(sid)
    Log.info(f"{user} connected from {environ['REMOTE_ADDR']}")


@sio.on("disconnect")
def on_disconnect(sid: str):
    set_greenlet_name("SIO/disconnect")
    user = shove.get_user_by_sid(sid)
    if not user:
        Log.warning(f"socketio.on('disconnect'): User object not found/already disconnected, ignoring call")
        return

    Log.trace(f"Handling disconnect of {user}")
    shove.on_disconnect(user)
    Log.info(f"{user} disconnected")


# TODO on connect, receive session cookie from user, check if session token valid, log in as that _account
@sio.on("message")
def on_message(sid: str, model: str, packet: Optional[dict]):
    set_greenlet_name("SIO/message")
    user = shove.get_user_by_sid(sid)
    if not user:
        Log.warning(f"User object not found/already disconnected, sending no_pong packet to SID {sid}")
        sio.emit("error", error_packet("You don't exist anymore (not good), refresh!"), to=sid)
        return

    # check if the packet doesn't exceed max size
    if sys.getsizeof(model) > MAX_MODEL_BYTES:
        Log.warning(f"Model from {user} exceeds max size, ignoring")
        shove.send_packet_to(user, "error", error_packet("Model of sent packet exceeds maximum allowed size"))
        return
    if sys.getsizeof(packet) > MAX_PACKET_BYTES:
        Log.warning(f"Packet from {user} exceeds max size, ignoring")
        shove.send_packet_to(user, "error", error_packet(f"Content of sent packet '{model}' exceeds maximum allowed size"))
        return

    packet_id = shove.get_next_packet_id()
    Log.trace(f"Received packet #{packet_id} from {user}")
    shove.incoming_packets_queue.put((user, model, packet, packet_id))


# main function

def main():
    print("\n\n\t\"Hey Vsauce, Michael here.\" - Michael Stevens\n\n")

    setup_files_and_folders()
    eventlet.spawn(Log.write_file_loop)
    global shove
    shove = Shove(sio)
    eventlet.spawn(send_packets_loop, shove, sio)
    eventlet.spawn(handle_packets_loop, shove)

    if PING_USERS_ENABLED:
        eventlet.spawn(ping_users_loop, shove)

    use_ssl = "-no-ssl" not in sys.argv
    if not use_ssl:
        Log.warning("SSL DISABLED! Remove '-no-ssl' from sys.argv to enable")

    Log.info(f"Starting SocketIO WSGI on port 777! use_ssl={use_ssl}, private keys: {PRIVATE_KEYS_IMPORTED}")
    wsgi_app = socketio.WSGIApp(sio)
    http_socket = eventlet.listen((HOST, PORT))

    if use_ssl:
        # wrap_ssl https://stackoverflow.com/a/39420484/13216113
        ssl_socket = eventlet.wrap_ssl(
            http_socket,
            certfile="cert.pem",
            keyfile="key.pem",
            server_side=True
        )
        eventlet.wsgi.server(ssl_socket, wsgi_app, log_output=LOG_WSGI)
    else:
        eventlet.wsgi.server(http_socket, wsgi_app, log_output=LOG_WSGI)

    print("\n\n\t\"And as always, thanks for watching.\" - Michael Stevens\n\n")


def setup_files_and_folders():
    print("Setting up files and folders")

    create_folders = [  # specific order!
        DATABASES_FOLDER,
        FILES_FOLDER,
        f"{FILES_FOLDER}/{AVATARS_FOLDER}",
        f"{FILES_FOLDER}/{SONGS_FOLDER}",
        LOGS_FOLDER
    ]
    create_files = [  # create files AFTER folders!
        f"{DATABASES_FOLDER}/accounts.json",
        f"{DATABASES_FOLDER}/songs.json",
        f"{LOGS_FOLDER}/{LATEST_LOG_FILENAME}"
    ]

    for folder in create_folders:
        if not os.path.exists(folder):
            os.mkdir(folder)
            print(f"Created folder: {folder}")

    for file in create_files:
        if not os.path.exists(file):
            if file.endswith(".json"):
                with open(file, "w") as f:
                    f.write("{}")  # empty json file

                print(f"Created JSON file: {file}")
            else:
                open(file, "w").close()
                print(f"Created file: {file}")

    if ENABLE_FILE_LOGGING:
        open(f"{LOGS_FOLDER}/{LATEST_LOG_FILENAME}", "w").close()
        print(f"Emptied {LATEST_LOG_FILENAME}")

    if STARTUP_CLEANUP_BACKEND_CACHE:
        count = 0
        for filename in os.listdir(f"{FILES_FOLDER}/{SONGS_FOLDER}"):
            if not filename.endswith(".mp3"):
                os.remove(f"{FILES_FOLDER}/{SONGS_FOLDER}/{filename}")
                count += 1

        print(f"Removed {count} file(s) that weren't .mp3 from songs folder")


if __name__ == "__main__":
    while True:
        try:
            main()

        except Exception as _ex:
            Log.critical("Unhandled exception on main", ex=_ex)

        Log.trace(f"Restarting in {DELAY_BEFORE_RESTART} s")
        time.sleep(DELAY_BEFORE_RESTART)
