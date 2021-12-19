import eventlet
eventlet.monkey_patch()  # nopep8

from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO

from convenience import *
from ferdy import Ferdy
from log import Log
from packet_handler import handle_packets_loop
from packet_sender import send_packets_loop


set_greenlet_name("Main")

# setup flask

flask_app = Flask(__name__)
CORS(flask_app)

if SCARY_SECRETS_IMPORTED:
    flask_app.config["SECRET_KEY"] = FLASK_SECRET_KEY
else:
    # random key, cookies will not work
    flask_app.config["SECRET_KEY"] = secrets.token_hex(32)


# setup socketio
sio = SocketIO(
    app=flask_app,
    async_mode="eventlet",
    cors_allowed_origins='*',
    logger=LOG_SOCKETIO,  # socketio logger
    engineio_logger=LOG_ENGINEIO  # engineio logger
)

# setup ferdy
ferdy: Union[Ferdy, None] = None


# flask routes

@flask_app.get("/test")
def get_test():
    Log.debug("get_test()")
    return {"deez": ""}


@flask_app.post("/")
def post():
    body = request.json
    Log.debug(f"post {body=}")
    return {"status": "success"}


# socketio events

@sio.on("connect")
def on_connect():
    set_greenlet_name("sio/on_connect")
    sid = request.sid
    address = request.environ["REMOTE_ADDR"]
    Log.debug(f"Handling connect, {sid[:4]=} {address=}")
    user = ferdy.handle_connect(sid, address)

    if not user:
        Log.error("Refusing connect attempt, could not create user object")
        return False  # refuse the connection

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
        app=flask_app,
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
