from convenience import *
from ferdy import Ferdy
from profile_dbe import Profile
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

        except BasePacketError as ex:
            Log.debug(f"Packet handling error caught: {ex.error}")
            response_packet = error_packet(ex.error, name, content)

        except Exception as ex:
            Log.error("Unhandled exception on handle_packet", ex=ex)
            response_packet = error_packet(
                "internal_backend_error", name, content)

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

    if content is None:
        content = {}

    assert type(content) == dict, \
        f"invalid 'content' type: {type(content).__name__}"

    # permission

    if name == "permission.list":
        return "permission.list", {
            "permissions": ferdy.roles.get_permissions()
        }

    # profile

    if name == "profile.approval":
        user.has_permission("profile.approval", raise_if_not=True)
        entry_id = content["entry_id"]
        profile = ferdy.profiles.find_single(entry_id=entry_id,
                                             raise_missing=True)

        # todo add special permission for force setting approval status
        # if not profile["pending_approval"]:
        #     raise ProfileNotPendingApproval

        approved = content["approved"]
        profile["is_approved"] = approved
        profile["pending_approval"] = False

        ferdy.broadcast("profile.list", {
            "profiles": ferdy.profiles.get_entries_data_copy()
        })

        return True

    if name == "profile.data":
        raise BasePacketNotImplemented

    if name == "profile.delete":
        user.has_permission("profile.delete", raise_if_not=True)
        entry_id = content["entry_id"]
        profile: Profile = ferdy.profiles.find_single(entry_id=entry_id,
                                                      raise_missing=True)

        # log out user that is logged in using the specified profile
        if profile["is_online"]:
            for online_user in ferdy.get_users_copy():
                online_profile: Profile = online_user.get_profile()
                if not online_profile:
                    continue

                if online_profile["entry_id"] == profile["entry_id"]:
                    ferdy.handle_log_out(online_user, broadcast=False)

        profile.delete()

        ferdy.broadcast("profile.list", {
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

        ferdy.broadcast("profile.list", {
            "profiles": ferdy.profiles.get_entries_data_copy()
        })

        return True

    # role

    if name == "role.create":
        user.has_permission("role.create", raise_if_not=True)
        ferdy.roles.create()

        ferdy.broadcast("role.list", {
            "roles": ferdy.roles.get_entries_data_copy()
        })

        return True

    # todo be DRY and move existence check to db
    if name == "role.delete":
        user.has_permission("role.delete", raise_if_not=True)
        entry_id = content["entry_id"]
        role = ferdy.roles.find_single(entry_id=entry_id, raise_missing=True)
        role.delete()

        ferdy.broadcast("role.list", {
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

        for key, value in updated_data.items():
            if role[key] == value:
                Log.debug(f"Data is the same, not updating, {key=}, {value=}")
            else:
                role[key] = value

        ferdy.broadcast("role.list", {
            "roles": ferdy.roles.get_entries_data_copy()
        })

        return True

    # room

    if name == "room.data":
        raise BasePacketNotImplemented

    if name == "room.join":
        raise BasePacketNotImplemented

    if name == "room.leave":
        raise BasePacketNotImplemented

    if name == "room.list":
        raise BasePacketNotImplemented

    # song

    if name == "song.play":
        raise BasePacketNotImplemented

    if name == "song.queue":
        raise BasePacketNotImplemented

    if name == "song.rate":
        raise BasePacketNotImplemented

    if name == "song.search":
        raise BasePacketNotImplemented

    if name == "song.skip":
        raise BasePacketNotImplemented

    # user

    if name == "user.log_in":
        if user.is_logged_in():
            raise UserAlreadyLoggedIn

        fake = content["fake"]
        if fake:
            google_id = content["google_id"]

            # lookup the profile matching the google id
            Log.debug("Checking if profile exists")
            profile = ferdy.profiles.find_single(google_id=google_id)

            if not profile:
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
            raise UserNotLoggedIn

        ferdy.handle_log_out(user, broadcast=True)

        return

    if name == "user.message":
        if not user.is_logged_in():
            raise UserNotLoggedIn

        ferdy.broadcast("user.message", {
            "author": user.get_profile().get_data_copy(),
            "text": content["text"],
        })

        return

    # if packet name didn't match with any known names, raise error
    raise BasePacketNotImplemented
