import eventlet
eventlet.monkey_patch()  # nopep8

from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO

from convenience import *
from ferdy import Ferdy
from log import Log


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
    engineio_logger=LOG_ENGINEIO  # engione logger
)

# setup ferdy
ferdy: Union[Ferdy, None] = None


# flask routes

@flask_app.get("/test")
def get_test():
    Log.trace("get_test()")
    return {"deez": "nutz"}


@flask_app.post("/")
def post():
    body = request.json
    Log.trace(f"post {body=}")
    return {"status": "success"}


# socketio events

@sio.on("connect")
def on_connect():
    set_greenlet_name("sio.conn")
    sid = request.sid
    address = request.environ["REMOTE_ADDR"]
    print("test1")
    Log.debug(f"connect {sid=} {address=}")


@sio.on("disconnect")
def on_disconnect():
    set_greenlet_name("sio.disc")
    sid = request.sid
    Log.debug(f"disconnect {sid=}")


@sio.on("message")  # = anything that is not connect or disconnect
def on_packet(name, content):
    set_greenlet_name("sio.pack")
    sid = request.sid
    Log.debug(f"Got packet {name=}", content=content)
    sio.emit("testmessage", {"test": "message"}, to=sid)


def main():
    setup_files_and_folders()

    global ferdy
    ferdy = Ferdy(sio)

    eventlet.spawn(Log.log_writer_loop)

    Log.info(f"Starting on {PORT=}")
    # TODO start with ssl if -h flag not in argv
    sio.run(
        app=flask_app,
        host=HOST,
        port=PORT,
        debug=DEBUG,
        log_output=LOG_CONNECTIONS
    )


if __name__ == "__main__":
    while True:
        print("\n\n\n\tHey Vsauce, Michael here!\n\n\n")

        try:
            main()
        except Exception as ex:
            Log.error("Unhandled exception on main", ex=ex)

        if CRASH_RESTART_DELAY:
            Log.info(f"Restarting in {CRASH_RESTART_DELAY} s")

        print("\n\n\n\tAnd as always, thanks for watching.\n\n\n")

        time.sleep(CRASH_RESTART_DELAY)
