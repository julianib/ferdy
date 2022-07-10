from convenience import *
from profile_dbe import Profile
from user import User
import verify_jwt
from packet_sending import send_packet


# TODO split up different handlers into different files, roles, user, etc.


def handle_packet(ferdy, user, name, content, packet_id) -> None:
    """
    Wrapper function for handling a packet and any possible response packet
    returned from processing said packet. Should be run on separate greenlet
    thread.
    """

    set_greenlet_name(f"HandlePacket/#{packet_id}")
    Log.info(f"Handling packet #{packet_id}, {name=}", content=content)

    try:
        response_packet = _handle_packet_actually(
            ferdy, user, name, content)

    except BasePacketError as ex:
        Log.debug(f"Packet handling error caught: {ex.error}")
        response_packet = error_packet(ex.error, name, content)

    except Exception as ex:
        Log.error("Unhandled exception on _handle_packet_actually", ex=ex)
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
            return

        send_packet(ferdy, user, response_name, response_content, None)

    Log.debug("Handled packet")


def _handle_packet_actually(
        ferdy, user: User, name: str, content: Union[dict, None]) -> \
        Union[tuple, str, bool, None]:
    """
    Process a packet and return an optional response packet.
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
            "data": ferdy.get_permissions()
        }

    # poll

    if name == "poll.create":
        user.has_permission("poll.create", raise_if_not=True)
        allow_multiple_choices = content["allow_multiple_choices"]
        body = content["body"]
        title = content["title"]

        ferdy.polls.create(
            allow_multiple_choices=allow_multiple_choices,
            body=body,
            title=title,
        )

        ferdy.broadcast("poll.list", {
            "data": ferdy.polls.get_entries_data_copy()
        })

        return True

    if name == "poll.list":
        return "poll.list", {
            "data": ferdy.polls.get_entries_data_copy()
        }

    # profile

    if name == "profile.approval":
        user.has_permission("profile.approval", raise_if_not=True)
        profile_id = content["id"]
        profile = ferdy.profiles.find_single(id=profile_id, raise_missing=True)

        approved = content["approved"]
        profile["is_approved"] = approved
        profile["pending_approval"] = False

        ferdy.broadcast("profile.list", {
            "data": ferdy.profiles.get_entries_data_copy()
        })

        return True

    if name == "profile.data":
        raise PacketNotImplemented

    if name == "profile.delete":
        user.has_permission("profile.delete", raise_if_not=True)
        profile_id = content["id"]
        profile = ferdy.profiles.find_single(id=profile_id, raise_missing=True)

        # log out user that is logged in using the specified profile
        if profile["is_online"]:
            for online_user in ferdy.get_users_copy():
                online_profile: Profile = online_user.get_profile()
                if not online_profile:
                    continue

                if online_profile["id"] == profile["id"]:
                    ferdy.handle_log_out(online_user, broadcast=False)

        profile.delete()

        ferdy.broadcast("profile.list", {
            "data": ferdy.profiles.get_entries_data_copy()
        })

        return True

    if name == "profile.list":
        return "profile.list", {
            "data": ferdy.profiles.get_entries_data_copy(),
        }

    if name == "profile.update":
        # todo make db entry method for updating
        user.has_permission("profile.update", raise_if_not=True)
        updated_data = content["updated_data"]
        profile_id = content["id"]
        profile = ferdy.profiles.find_single(id=profile_id, raise_missing=True)

        for key, value in updated_data.items():
            # only update date if necessary
            if profile[key] == value:
                Log.debug(f"Data is the same, not updating, {key=}, {value=}")
            else:
                profile[key] = value

        ferdy.broadcast("profile.list", {
            "data": ferdy.profiles.get_entries_data_copy()
        })

        return True

    # role

    if name == "role.create":
        user.has_permission("role.create", raise_if_not=True)
        ferdy.roles.create()

        ferdy.broadcast("role.list", {
            "data": ferdy.roles.get_entries_data_copy()
        })

        return True

    # todo remove role from all users before deleting
    if name == "role.delete":
        user.has_permission("role.delete", raise_if_not=True)
        role_id = content["id"]
        role = ferdy.roles.find_single(id=role_id, raise_missing=True)
        role.delete()

        ferdy.broadcast("role.list", {
            "data": ferdy.roles.get_entries_data_copy()
        })

        return True

    if name == "role.list":
        return "role.list", {
            "data": ferdy.roles.get_entries_data_copy()
        }

    if name == "role.update":
        user.has_permission("role.update", raise_if_not=True)
        role_id = content["id"]
        updated_data = content["updated_data"]
        role = ferdy.roles.find_single(id=role_id, raise_missing=True)

        for key, value in updated_data.items():
            if role[key] == value:
                Log.debug(f"Data is the same, not updating, {key=}, {value=}")
            else:
                role[key] = value

        ferdy.broadcast("role.list", {
            "data": ferdy.roles.get_entries_data_copy()
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
                profile["name"] = f"New profile #{profile['id']}"
            
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
    raise PacketNotImplemented