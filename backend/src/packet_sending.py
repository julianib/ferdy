from convenience import *
from user import User


def send_packet(ferdy, users, name, content, skip_users) -> None:
    """
    Wrapper function for sending a packet, including complete logging and
    error handling.
    """

    Log.debug(f"Sending packet, {name=}", content=content)

    try:
        sent_to = _send_packet_actually(
            ferdy.sio, users, name, content, skip_users)

    except Exception as ex:
        Log.error("Unhandled exception on _send_packet_actually", ex=ex)
        return

    if sent_to:
        Log.debug(f"Sent packet to {len(sent_to)} user(s)")
    else:
        Log.debug("No recipients for packet, didn't send")


def _send_packet_actually(sio, users: Union[User, list], name, content,
                          skip_users) -> list:
    """
    Actually send the packet over socket, return list of users the packet was
    sent to.\
    """

    if type(users) == User:
        users = [users]

    assert type(users) == list, f"invalid 'users' type: {type(users).__name__}"

    if skip_users:
        if type(skip_users) == User:
            skip_users = [skip_users]

        assert type(skip_users) == list, \
            f"invalid 'skip_users' type: {type(skip_users).__name__}"

        for user in users.copy():
            if user in skip_users:
                users.remove(user)

    for user in users:
        sio.emit(name, content, to=user.sid)

    return users
