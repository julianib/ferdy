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
flask_app.config["SECRET_KEY"] = FLASK_SECRET_KEY
CORS(flask_app)

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
    print("get test")
    return {"deez": "nutz"}


@flask_app.post("/")
def post():
    body = request.json
    print(f"post {body=}")
    return {"status": "success"}


# socketio events

@sio.on("connect")
def on_connect():
    sid = request.sid
    address = request.environ["REMOTE_ADDR"]
    print(f"connect {sid=} {address=}")


@sio.on("disconnect")
def on_disconnect():
    sid = request.sid
    print(f"disconnect {sid=}")


@sio.on("message")
def on_message(packet):
    sid = request.sid
    print(f"message {packet=}")
    sio.emit("testmessage", {"type": "yeet"}, to=sid)


def setup_files_and_folders():
    """
    Create and setup (missing) folders and files
    """

    print("Setting up files and folders")

    # list of folders to create, in specific order
    create_folders = [
        DATABASES_FOLDER,
        FILES_FOLDER,
        AVATARS_FOLDER,
        SONGS_FOLDER,
        LOGS_FOLDER
    ]

    # create files after folders
    create_files = [
        f"{DATABASES_FOLDER}/accounts.json",
        f"{DATABASES_FOLDER}/songs.json",
        f"{LOGS_FOLDER}/.latest.txt"
    ]

    for folder in create_folders:
        if not os.path.exists(folder):
            os.mkdir(folder)
            print(f"Created folder {folder}")

    for file in create_files:
        if not os.path.exists(file):
            if file.endswith(".json"):
                # empty json files contain curly braces
                with open(file, "w") as f:
                    f.write("{}")

            else:
                open(file, "w").close()

            print(f"Created file {file}")

    if FILE_LOG_LEVEL:
        open(f"{LOGS_FOLDER}/.latest.txt", "w").close()
        print(f"Emptied latest log")

    removed_songs_trash = 0
    for filename in os.listdir(SONGS_FOLDER):
        if not filename.endswith(".mp3"):
            os.remove(f"{SONGS_FOLDER}/{filename}")
            removed_songs_trash += 1

    if removed_songs_trash:
        print(f"Removed {removed_songs_trash} trash file(s) from songs folder")


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
            Log.critical("Unhandled exception on main", ex=ex)

        Log.info(f"Restarting in {CRASH_RESTART_DELAY} s")

        print("\n\n\n\tAnd as always, thanks for watching.\n\n\n")
        time.sleep(CRASH_RESTART_DELAY)
