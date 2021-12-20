import eventlet
eventlet.monkey_patch()  # nopep8

from flask import Flask, request, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO

from convenience import *
from ferdy import Ferdy
from log import Log
from packet_handler import handle_packets_loop
from packet_sender import send_packets_loop

# setup flask

app = Flask(__name__)
CORS(app)

if SCARY_SECRETS_IMPORTED:
    app.config["SECRET_KEY"] = FLASK_SECRET_KEY
else:
    # random key, cookies will not work
    app.config["SECRET_KEY"] = secrets.token_hex(32)


# setup socketio
sio = SocketIO(
    app=app,
    async_mode="eventlet",
    cors_allowed_origins='*',
    logger=LOG_SOCKETIO,  # socketio logger
    engineio_logger=LOG_ENGINEIO  # engineio logger
)

# setup ferdy
ferdy: Union[Ferdy, None] = None


# flask routes

@app.get(f"/{AVATARS_FOLDER}/<filename>")
def get_avatar(filename):
    set_greenlet_name("app/get_avatar")

    # TODO implement check if user is authorized

    # file_type = filename.split(".")[-1]
    # if file_type not in ["png", "jpg"]:
    Log.debug(f"Reading avatar file, {filename=}")

    if os.path.exists(f"{AVATARS_FOLDER}/{filename}"):
        return send_from_directory(f"{os.getcwd()}/{AVATARS_FOLDER}", filename)
    else:
        Log.warning(f"Requested file not found, using default, {filename=}")
        if os.path.exists(f"{AVATARS_FOLDER}/default.png"):
            return send_from_directory(f"{os.getcwd()}/{AVATARS_FOLDER}",
                                       "default.png")
        else:
            Log.warning("Fallback avatar file default.png does not exist")
            return error_content("backend")


@app.get("/")
def get():
    set_greenlet_name("app/get")
    return "GET root!"


@app.post("/")
def post():
    set_greenlet_name("app/post")
    body = request.json
    Log.test(f"post {body=}")
    return "POST root!"


@app.errorhandler(404)
def app_errorhandler(e):
    set_greenlet_name("app/error")
    path = request.path
    Log.warning(f"Exception on flask app, {path=}", ex=e)
    return error_content("backend")


# socketio events

@sio.on("connect")
def on_connect():
    set_greenlet_name("sio/on_connect")
    sid = request.sid
    address = request.environ["REMOTE_ADDR"]
    Log.debug(f"Handling connect, {sid[:4]=} {address=}")
    user = ferdy.handle_connect(sid, address)

    # refuse the connection if user object was not created
    if not user:
        Log.error("Refusing connect attempt, user object not created")
        return False

    Log.info(f"{user} connected")


@sio.on("disconnect")
def on_disconnect():
    set_greenlet_name("sio/on_disconnect")
    sid = request.sid
    user = ferdy.get_user_by_sid(sid)

    if not user:
        Log.error(f"Couldn't handle disconnect: no user object, {sid[:4]=}")
        return

    Log.debug(f"Handling disconnect of {user}")
    ferdy.handle_disconnect(user)
    Log.info(f"{user} disconnected")


@sio.on("message")  # = anything that is not connect or disconnect
def on_packet(name, content):
    set_greenlet_name("sio/on_packet")
    sid = request.sid
    user = ferdy.get_user_by_sid(sid)
    if not user:
        Log.warning(f"Couldn't handle packet: no user object, {sid[:4]=}")
        return

    # TODO check max size of name and content

    packet_id = ferdy.get_next_packet_id()
    Log.info(f"Received packet #{packet_id} from {user}, {name=}")
    ferdy.incoming_packets_queue.put((user, name, content, packet_id))


def main():
    set_greenlet_name("MAIN")
    setup_folders()  # TODO fix cwd problem that causes extra files

    if FILE_LOG_LEVEL:
        eventlet.spawn(Log.log_writer_loop)

    global ferdy
    ferdy = Ferdy(sio)
    eventlet.spawn(send_packets_loop, ferdy)
    eventlet.spawn(handle_packets_loop, ferdy)

    # TODO start with ssl if -h flag not in argv
    Log.info(f"Starting on {PORT=}")

    sio.run(
        app=app,
        host=HOST,
        port=PORT,
        debug=DEBUG_FLASK,
        log_output=LOG_CONNECTIONS
    )


if __name__ == "__main__":
    while True:
        print("\n\n\n\tHey Vsauce, Michael here!\n\n\n")

        Log.test("test")
        Log.debug("debug")
        Log.info("info")
        Log.warning("warning")
        Log.error("error")

        try:
            main()
        except Exception as ex:
            Log.error("Unhandled exception on main", ex=ex)

        if not CRASH_RESTART_DELAY:
            print("\n\n\n\tAnd as always, thanks for watching.\n\n\n")
            break

        Log.info(f"Restarting in {CRASH_RESTART_DELAY} s")
        time.sleep(CRASH_RESTART_DELAY)
