import eventlet
eventlet.monkey_patch()  # nopep8

from flask import Flask, request, jsonify
from flask_socketio import SocketIO

from flask_cors import CORS


flask_app = Flask(__name__)
CORS(flask_app)
flask_app.config["SECRET_KEY"] = "SECRET KEY"

sio = SocketIO(
    app=flask_app,
    async_mode="eventlet",
    cors_allowed_origins='*',
    logger=False,  # socketio logger
    engineio_logger=False  # engione logger
)


@flask_app.get("/test")
def get_test():
    print("get test")
    return {"deez": "nutz"}


@flask_app.post("/")
def post():
    body = request.data
    print(f"post {body=}")
    return jsonify({"status": "success"})


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


if __name__ == "__main__":
    sio.run(
        app=flask_app,
        port=1962,
        debug=True,  # run in debug mode
        log_output=False  # log incoming conns
    )
