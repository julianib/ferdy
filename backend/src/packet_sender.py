from convenience import *
from user import User


# todo removing queueing for outgoing packets and send them right away!!!!


def send_packet(ferdy, users, name, content, skip_users) -> None:
    """
    Send a packet, including complete logging and error handling
    """

    users, name, content, packet_id, skip_users = \
        ferdy.outgoing_packets_queue.get()
    Log.debug(f"Sending packet #{packet_id}, {name=}", content=content)

    try:
        sent_to = send_packet_actually(
            ferdy.sio, users, name, content, skip_users)

    except Exception as ex:
        Log.error("Unhandled exception on send_packet_actually", ex=ex)
        continue

    if sent_to:
        Log.debug(f"Sent packet to {len(sent_to)} user(s)")
    else:
        Log.debug("No recipients for packet, didn't send")


def send_packet_actually(sio, users: Union[User, list], name, content,
                         skip_users) \
        -> list:
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
