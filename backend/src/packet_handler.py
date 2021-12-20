from convenience import *
from ferdy import Ferdy
from user import User


def handle_packets_loop(ferdy: Ferdy):
    """
    Blocking loop for handling incoming packets
    """

    set_greenlet_name("PacketHandler")
    Log.debug("Handle packets loop ready")

    while True:
        user, name, content, packet_id = ferdy.incoming_packets_queue.get()
        set_greenlet_name(f"PacketHandler/#{packet_id}")
        Log.debug(f"Handling packet, {name=}",
                  content=content or "<no content>")

        try:
            response_packet = handle_packet(ferdy, user, name, content)

        except NotImplementedError:
            Log.debug("Handling failed: not implemented")
            response_packet = "error", error_content("not_implemented")

        except Exception as ex:
            # TODO if user has correct roles, give error traceback in packet
            Log.error("Unhandled exception on handle_packet", ex=ex)
            response_packet = "error", error_content("backend")

        if response_packet:

            # prevent IndexError
            if type(response_packet) == tuple and len(response_packet) == 2:
                response_name, response_content = response_packet
            elif type(response_packet) == str:
                response_name, response_content = response_packet, None
            else:
                Log.error(f"Handled packet but response packet structure is "
                          f"invalid, skipping, {response_packet=}")
                continue

            response_packet_id = ferdy.get_next_packet_id()
            Log.debug(f"Handled packet, instant response is "
                      f"#{response_packet_id}")
            ferdy.outgoing_packets_queue.put(
                (user, response_name, response_content, response_packet_id,
                 None)
            )

        else:
            Log.debug("Handled packet, no response packet")


def handle_packet(ferdy: Ferdy, user: User, name: str,
                  content: Union[dict, list, None]) -> Union[tuple, str, None]:
    """
    Handle a packet and return an optional direct response packet
    """

    if not name:
        raise ValueError("No packet name given")

    # prevent NoneType AttributeErrors
    if content is None:
        content = {}

    elif type(content) is not dict:
        content_type = type(content).__name__
        raise ValueError(f"Invalid packet content type, {content_type=}")

    # aim is to have as little as possible handlers for frontend to register
    # and unregister each time components call useEffect

    # TODO split up different handlers into different files, room, user, etc.

    # game packets should be handled by game handler
    # TODO implement games

    # profile

    if name == "profile.data":
        raise NotImplementedError

    if name == "profile.list":
        raise NotImplementedError

    # room

    if name == "room.data":
        raise NotImplementedError

    if name == "room.join":
        raise NotImplementedError

    if name == "room.leave":
        raise NotImplementedError

    if name == "room.list":
        raise NotImplementedError

    # song

    if name == "song.play":
        raise NotImplementedError

    if name == "song.queue":
        raise NotImplementedError

    if name == "song.rate":
        raise NotImplementedError

    if name == "song.search":
        raise NotImplementedError

    if name == "song.skip":
        raise NotImplementedError

    # user

    if name == "user.log_in":
        if user.is_logged_in():
            return "user.log_in.error", error_content("already_logged_in")

        # TODO actually verify???
        Log.debug("Skipping token verification")

        google_id = int(content["google_id"])
        name = content["name"]

        # lookup the profile matching the google id
        Log.debug("Checking if profile exists")
        profile = ferdy.profiles.match_single(google_id=google_id)

        # if profile does not exist in db, create it
        if not profile:
            profile = ferdy.profiles.create_profile(
                google_id=google_id,
                name=name,
            )

        # TODO provide a session token for the user (for POST fetches)
        user.log_in(profile)

        return "user.log_in.ok", {  # TODO return profile jsonable
            "avatar_url": "<url>",
            "email": "<email>",
            "first_name": "<first_name>",
            "last_name": "<last_name>",
            "name": profile["name"],
        }

    if name == "user.log_in.google_error":
        Log.debug(f"User {user} got google log in error")
        return

    if name == "user.log_out":
        if not user.is_logged_in():
            return "user.log_out.error", error_content("not_logged_in")

        user.log_out()

        return "user.log_out.ok"

    if name == "user.message.send":
        if not user.is_logged_in():
            return "user.message.send.error", error_content("not_logged_in")

        ferdy.send_packet_to_all("user.message.receive", {
            "author": user.get_profile()["name"],
            "text": content["text"],
        })
        return

    raise NotImplementedError
