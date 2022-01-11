from convenience import *
from ferdy import Ferdy
from user import User
import verify_jwt


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

        except PacketHandlingError as ex:
            Log.debug(f"PacketHandlingError caught: {ex.error}")
            response_packet = error_packet(ex.error, name, content)

        except Exception as ex:
            Log.error("Unhandled exception on handle_packet", ex=ex)
            response_packet = error_packet("unhandled_exception", name, content)

        if response_packet:
            # prevent IndexError
            if type(response_packet) == tuple and len(response_packet) == 2:
                response_name, response_content = response_packet
            elif type(response_packet) == str:
                response_name, response_content = response_packet, None
            elif type(response_packet) == bool:
                response_name, response_content = ok_packet(name, content)
            else:
                Log.error("Invalid response packet type given, skipping, "
                          f"{response_packet=}")
                continue

            response_packet_id = ferdy.get_next_packet_id()
            Log.debug(f"Handled packet, {response_packet_id=}")
            ferdy.outgoing_packets_queue.put(
                (user, response_name, response_content, response_packet_id,
                 None)
            )

        else:
            Log.debug("Handled packet, no response packet")


def handle_packet(ferdy: Ferdy, user: User,
                  name: str, content: Union[dict, None]) -> \
        Union[tuple, str, bool, None]:
    """
    Handle a packet and return an optional direct response packet.
    Returns True if an OK response should be sent back.

    - aim is to have as little as possible packet names for frontend to listen
    to.
    - content keys should_be_pep8.
    """

    assert name, "no packet name given"

    # prevent NoneType AttributeErrors
    if content is None:
        content = {}

    assert type(content) == dict, \
        f"invalid content type: {type(content).__name__}"

    # permission

    if name == "permission.list":
        return "permission.list", {
            "permissions": ferdy.roles.get_permissions()
        }

    # profile

    if name == "profile.data":
        raise PacketNotImplemented

    if name == "profile.delete":
        user.has_permission("profile.delete", raise_if_not=True)
        entry_id = content["entry_id"]
        profile = ferdy.profiles.find_single(entry_id=entry_id,
                                             raise_missing=True)
        profile.delete()

        ferdy.send_packet_to_all("profile.list", {
            "profiles": ferdy.profiles.get_entries_data_copy()
        })

        return True

    if name == "profile.list":
        profiles = ferdy.profiles.get_entries_data_copy()

        return "profile.list", {
            "profiles": profiles,
        }

    if name == "profile.update":  # todo make db entry method for updating
        user.has_permission("profile.update", raise_if_not=True)
        updated_data = content["updated_data"]
        entry_id = content["entry_id"]
        profile = ferdy.profiles.find_single(entry_id=entry_id,
                                             raise_missing=True)

        for key, value in updated_data.items():
            # only update date if necessary
            if profile[key] == value:
                Log.debug(f"Data is the same, not updating, {key=}, {value=}")
            else:
                profile[key] = value
                Log.debug(f"Updated data of {profile}, {key=}, {value=}")

        ferdy.send_packet_to_all("profile.list", {
            "profiles": ferdy.profiles.get_entries_data_copy()
        })

        return True

    # role

    if name == "role.create":
        user.has_permission("role.create", raise_if_not=True)
        role = ferdy.roles.create()

        ferdy.send_packet_to_all("role.list", {
            "roles": ferdy.roles.get_entries_data_copy()
        })

        return True

    if name == "role.delete":  # todo be DRY and move existence check to db
        user.has_permission("role.delete", raise_if_not=True)
        entry_id = content["entry_id"]
        role = ferdy.roles.find_single(entry_id=entry_id, raise_missing=True)
        role.delete()

        ferdy.send_packet_to_all("role.list", {
            "roles": ferdy.roles.get_entries_data_copy()
        })

        return True

    if name == "role.list":
        roles = ferdy.roles.get_entries_data_copy()

        return "role.list", {
            "roles": roles
        }

    if name == "role.update":
        user.has_permission("role.update", raise_if_not=True)
        entry_id = content["entry_id"]
        updated_data = content["updated_data"]
        role = ferdy.roles.find_single(entry_id=entry_id, raise_missing=True)

        for key, value in updated_data.items():  # todo NOT DRY
            if role[key] == value:
                Log.debug(f"Data is the same, not updating, {key=}, {value=}")
            else:
                role[key] = value
                Log.debug(f"Updated data of {role}, {key=}, {value=}")

        ferdy.send_packet_to_all("role.list", {
            "roles": ferdy.roles.get_entries_data_copy()
        })

        return True

    # room

    if name == "room.data":
        raise PacketNotImplemented

    if name == "room.join":
        raise PacketNotImplemented

    if name == "room.leave":
        raise PacketNotImplemented

    if name == "room.list":
        raise PacketNotImplemented

    # song

    if name == "song.play":
        raise PacketNotImplemented

    if name == "song.queue":
        raise PacketNotImplemented

    if name == "song.rate":
        raise PacketNotImplemented

    if name == "song.search":
        raise PacketNotImplemented

    if name == "song.skip":
        raise PacketNotImplemented

    # user

    if name == "user.log_in":
        if user.is_logged_in():
            raise AlreadyLoggedIn

        # todo share profile data across users if logged in from 2 SIDs

        fake = content["fake"]
        if fake:
            google_id = content["google_id"]

            Log.debug("Creating fake profile")

            # profile creation makes sure google_id is not taken
            profile = ferdy.profiles.create(google_id=google_id)
            profile["name"] = f"New profile #{profile['entry_id']}"
            
        else:
            jwt = content["jwt"]
            google_data = verify_jwt.verify(jwt, raise_if_invalid=True)
            google_id = google_data["sub"]

            # lookup the profile matching the google id
            Log.debug("Checking if profile exists")
            profile = ferdy.profiles.find_single(google_id=google_id)

            # if profile does not exist in db, create it
            # fields src: https://stackoverflow.com/a/59166759/13216113
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
                    avatar_external=True,
                    avatar_url=avatar_url,
                    name=name,
                    first_name=first_name,
                    last_name=last_name,
                    locale=locale,
                )

        ferdy.handle_log_in(user, profile)

        return

    if name == "user.log_in.google_error":
        Log.debug(f"User got google log in error")
        return

    if name == "user.log_out":
        if not user.is_logged_in():
            raise NotLoggedIn

        ferdy.handle_log_out(user)

        return

    if name == "user.message":
        if not user.is_logged_in():
            raise NotLoggedIn

        ferdy.send_packet_to_all("user.message", {
            "author": user.get_profile_data_copy(),
            "text": content["text"],
        })

        return

    # packet name didn't match with any known names, so raise error
    raise PacketNotImplemented
