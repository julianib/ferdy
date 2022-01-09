from convenience import *
from ferdy import Ferdy
from user import User
import verify_google_token_id


# TODO split up different handlers into different files, roles, user, etc.


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
                  content=content or "<NO CONTENT>")

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
                Log.error("Handled packet but response packet structure is "
                          f"invalid, skipping, {response_packet=}")
                continue

            response_packet_id = ferdy.get_next_packet_id()
            Log.debug(f"Handled packet, {response_packet_id=}")
            ferdy.outgoing_packets_queue.put(
                (user, response_name, response_content, response_packet_id,
                 None)
            )

        else:
            Log.debug("Handled packet, no response packet")


def handle_packet(ferdy: Ferdy, user: User, name: str,
                  content: Union[dict, list, None]) -> Union[tuple, str, None]:
    """
    Handle a packet and return an optional direct response packet.

    -> aim is to have as little as possible packet names for frontend to listen
       to.
    -> content keys should_be_pep8.
    """

    if not name:
        raise ValueError("No packet name given")

    # prevent NoneType AttributeErrors
    if content is None:
        content = {}

    elif type(content) is not dict:
        content_type = type(content).__name__
        raise ValueError(f"Invalid packet content type, {content_type=}")

    # profile

    if name == "profile.data":
        raise NotImplementedError

    if name == "profile.delete":
        raise NotImplementedError

    if name == "profile.list":
        profiles = ferdy.profiles.get_entries_data_copy(
            key=lambda p: p["entry_id"])

        return "profile.list.ok", {
            "profiles": profiles,
        }

    # role

    if name == "role.create":
        role = ferdy.roles.create()

        ferdy.send_packet_to_all("role.list.ok", {
            "roles": ferdy.roles.get_entries_data_copy()
        })

        return "role.create.ok", {
            "role": role.get_data_copy(),
        }

    if name == "role.delete":
        # todo check user authorized or not

        entry_id = content["entry_id"]

        try:
            role = ferdy.roles.match_single(
                raise_no_match=True, entry_id=entry_id)
        except NoEntriesMatch:
            return "role.delete.error", error_content("not_found")

        role.delete()

        ferdy.send_packet_to_all("role.list.ok", {
            "roles": ferdy.roles.get_entries_data_copy()
        })

        return "role.delete.ok", {
            "role": role.get_data_copy(),
        }

    if name == "role.list":
        roles = ferdy.roles.get_entries_data_copy(
            key=lambda r: r["entry_id"])

        return "role.list.ok", {
            "roles": roles
        }

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
        # todo share profile data across users if logged in from 2 SIDs

        token_id = content["token_id"]
        google_data = verify_google_token_id.verify(token_id)
        if not google_data:
            return "user.log_in.error", error_content("invalid_google_token")

        google_id = google_data["sub"]

        # lookup the profile matching the google id
        Log.debug("Checking if profile exists")
        profile = ferdy.profiles.match_single(google_id=google_id)

        # if profile does not exist in db, create it
        # info for the fields: https://stackoverflow.com/a/31099850/13216113
        if not profile:
            email = google_data["email"]
            email_verified = google_data["email_verified"]
            avatar_url = google_data["picture"]
            name = google_data["name"]
            first_name = google_data["given_name"]
            last_name = google_data["family_name"]
            locale = google_data["locale"]

            profile = ferdy.profiles.create(
                google_id=google_id,
                email=email,
                email_verified=email_verified,
                avatar_url=avatar_url,
                name=name,
                first_name=first_name,
                last_name=last_name,
                locale=locale,
            )

        ferdy.handle_log_in(user, profile)

        return "user.log_in.ok", {
            "profile": profile.get_data_copy()
        }

    if name == "user.log_in.google_error":
        Log.debug(f"User {user} got google log in error")
        return

    if name == "user.log_out":
        if not user.is_logged_in():
            return "user.log_out.error", error_content("not_logged_in")

        ferdy.handle_log_out(user)

        return "user.log_out.ok"

    if name == "user.send_message":
        if not user.is_logged_in():
            return "user.send_message.error", error_content("not_logged_in")

        ferdy.send_packet_to_all("user.receive_message", {
            "author": user.get_profile_data_copy(),
            "text": content["text"],
        })
        return

    raise NotImplementedError
