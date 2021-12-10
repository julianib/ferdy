from convenience import *

from shove import Shove
from user import User
from command_handler import handle_command
from search_song import search_song_task
from process_playlist_and_song import process_song_task


def handle_packets_loop(shove):
    """Blocking loop for handling packets (that were added to the queue)"""

    set_greenlet_name("PacketHandler")
    Log.trace("Handle packets loop ready")

    while True:
        user, model, packet, packet_id = shove.incoming_packets_queue.get()
        set_greenlet_name(f"PacketHandler/#{packet_id}")
        Log.debug(f"Handling packet #{packet_id}: '{model}'", packet=packet)

        try:
            direct_response = handle_packet(shove, user, model, packet)

        except CommandFailed as ex:
            Log.trace(f"Command invalid: {ex.description}")
            direct_response = "error", error_packet(ex.description)

        except PacketHandlingFailed as ex:
            Log.trace(f"Packet handling failed: {type(ex).__name__}: {ex.description}")
            direct_response = "error", error_packet(ex.description)

        except NotImplementedError as ex:
            Log.error("Not implemented", ex=ex)
            direct_response = "error", error_packet("Not implemented (yet)!")

        except Exception as ex:
            # note: if user purposely sends broken packets, KeyErrors will end up here aswell
            Log.critical("Unhandled exception on handle_packet", ex=ex)
            direct_response = "error", error_packet("Internal error on handling packet (shouldn't happen)")

        if direct_response:
            response_model, response_packet = direct_response
            response_packet_id = shove.get_next_packet_id()
            Log.trace(f"Handled packet, direct response packet is #{response_packet_id}")
            shove.outgoing_packets_queue.put((user, response_model, response_packet, None, response_packet_id))

        else:
            Log.trace(f"Handled packet, no direct response")


def handle_packet(shove: Shove, user: User, model: str, packet: dict) -> Optional[Tuple[str, Union[dict, list]]]:
    """Handles the packet and returns an optional DIRECT response model + packet"""

    if not model:
        raise ValueError("No model provided")

    # if packet was missing from the socketio message, it is None by default
    if packet is None:
        packet = {}  # if no packet provided, just pass on an empty dict to prevent None.getattribute errors

    if type(packet) is not dict:
        raise ValueError(f"Invalid packet type: {type(packet).__name__}")

    if model == "error":  # only errors that should NEVER happen are to be sent to backend (not errors like log in failure)
        Log.warning(f"User application sent error: {packet['description']}")
        # send the error back to the user so they can read the message themselves
        return "error", error_packet(packet["description"])

    # special game packet, should be handled by game's packet handler
    if model == "game_action":  # currently the only model for game packets
        if not user.is_logged_in():
            raise UserNotLoggedIn

        room = shove.get_room_of_user(user)

        if not room:
            raise UserNotInRoom

        if not room.game:
            raise GameNotSet

        response = room.game.handle_packet(user, model, packet)  # can return a response (model, packet) tuple
        return response

    if model == "get_account_data":
        if "username" in packet:
            username = packet["username"].strip()
            account = shove.accounts.find_single(username=username)

        elif user.is_logged_in():
            account = user.get_account()

        else:
            raise UserNotLoggedIn

        return "account_data", account.get_jsonable()

    if model == "get_account_list":
        raise NotImplementedError
        # account_list = []
        # for entry in shove.accounts.get_entries(key=lambda e: e["username"]):
        #     jsonable = entry.get_jsonable()
        #     jsonable["avatar"] = entry.get_avatar_bytes()
        #     account_list.append(jsonable)
        # return "account_list", account_list

    if model == "get_game_data":
        room = shove.get_room_of_user(user)

        if not room:
            raise UserNotInRoom

        if not room.game:
            raise GameNotSet

        return "game_data", room.get_game_data()

    if model == "get_room_data":
        raise NotImplementedError

    if model == "get_room_list":
        return "room_list", [room.get_data() for room in shove.get_rooms()]

    if model == "get_song_rating":
        if not shove.latest_song:
            Log.trace("No song playing, ignoring")
            return

        return "song_rating", shove.latest_song.get_rating_of(user)

    if model == "join_room":
        if shove.get_room_of_user(user):
            raise UserAlreadyInRoom

        room = shove.get_room(packet["room_name"])

        if not room:
            raise RoomNotFound

        room.user_tries_to_join(user)  # this throws an exception if user can't join room

        return "join_room", {
            "room_data": room.get_data(),
            "game_data": room.get_game_data()
        }

    if model == "leave_room":
        if not user.is_logged_in():
            raise UserNotLoggedIn

        room = shove.get_room_of_user(user)

        if not room:
            raise UserNotInRoom

        room.user_leaves(user)

        return "leave_room", {
            "room_name": room.name
        }

    if model == "log_in":
        username = packet["username"].strip()
        raw_password = str(packet["password"])  # can be None
        hashed_password = hashlib.sha256(bytes(raw_password, "utf-8")).hexdigest()
        account = shove.accounts.find_single(username=username)

        if account["password"] != hashed_password:
            # TODO raise PasswordInvalid
            Log.trace("Passwords do not match, but ignoring")
            pass

        user.log_in_as(account)

        return "log_in", account.get_jsonable()

    if model == "log_out":
        if not user.is_logged_in():
            raise UserNotLoggedIn

        shove.log_out_user(user)

        return

    if model == "play_song":
        category = packet["category"]

        if category == "popular":
            song = shove.songs.get_random_popular()

        elif category == "random":
            song = shove.songs.get_random()

        else:
            raise ActionInvalid(f"Invalid song category provided: {category}")

        if not song:
            raise NoSongsAvailable

        shove.songs.queue.put((song, user))
        Log.trace(f"Queued song to play: {song}")
        return

    if model == "pong":
        now = time.time()
        user.latency = now - user.pinged_timestamp
        user.last_pong_received = now
        Log.trace(f"Pong received from {user} ({user.pinged_timestamp}), latency: {round(user.latency * 1000)} ms")

        return "latency", {
            "latency": user.latency
        }

    if model == "queue_song":
        if not PRIVATE_KEYS_IMPORTED:  # backend host has no access to private keys
            raise NoPrivateKeys

        youtube_id = packet["youtube_id"]
        Log.trace(f"Added youtube id to queue: {youtube_id}")
        eventlet.spawn(process_song_task, shove, youtube_id, user)
        return "error", error_packet("Add some success notification")  # TODO impl

    if model == "rate_song":
        if not user.is_logged_in():
            raise UserNotLoggedIn

        song = shove.songs.current_song
        if not song:
            raise NoSongPlaying

        username = user.get_username()
        action = packet["action"]

        if action == "toggle_dislike":
            song.toggle_dislike(username)
        elif action == "toggle_like":
            song.toggle_like(username)
        else:
            raise ActionInvalid

        shove.songs.broadcast_rating_of(song)

        return

    if model == "register":
        username = str(packet["username"]).strip()
        raw_password = str(packet["password"])
        raw_repeat_password = str(packet["repeat_password"])

        if len(username) > USERNAME_MAX_LENGTH or len(username) < USERNAME_MIN_LENGTH:
            raise UsernameSizeInvalid

        if raw_password != raw_repeat_password:
            raise PasswordInvalid

        hashed_password = hashlib.sha256(bytes(raw_password, "utf-8")).hexdigest()

        account = shove.accounts.register_account(username=username, password=hashed_password)
        user.log_in_as(account)

        return "register", account.get_jsonable()

    if model == "search_song":
        if not PRIVATE_KEYS_IMPORTED:  # backend host has no access to private keys
            raise NoPrivateKeys

        query = packet["query"]

        Log.trace(f"Got song search query: {query}")
        eventlet.spawn(search_song_task, shove, query, user)
        return

    if model == "send_message":
        message: str = packet["message"].strip()

        if not message:
            Log.trace("Empty message provided, ignoring")
            return

        # check if message is a command first, as some commands don't require user to be logged in
        if message.startswith("/"):
            response_message = handle_command(shove, user, message)  # returns optional response message to user
            return "command_success", {
                "response": response_message
            }

        # not a command, so it is a chat message
        if not user.is_logged_in():
            raise UserNotLoggedIn

        username = user.get_username()
        Log.trace(f"Message from {username}: '{message}'")
        shove.send_packet_to_everyone("message", {
            "author": username,
            "text": message
        })
        return

    if model == "skip_song":
        if shove.songs.current_song:
            shove.songs.skip()

        else:
            raise NoSongPlaying

        return

    raise ModelInvalid

