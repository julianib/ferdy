from convenience import *
from user import User


# todo removing queueing for outgoing packets and just, send them right away?

def send_packets_loop(ferdy):
    """
    Blocking loop for sending packets
    """

    set_greenlet_name("PacketSender")
    Log.debug("Send packets loop ready")

    while True:
        users, name, content, packet_id, skip_users = \
            ferdy.outgoing_packets_queue.get()
        set_greenlet_name(f"PacketSender/#{packet_id}")
        Log.debug(f"Sending packet, {name=}", content=content)

        try:
            sent_to = send_packet(ferdy.sio, users, name, content, skip_users)

        except Exception as ex:
            Log.error("Unhandled exception on send_packet", ex=ex)
            continue

        if sent_to:
            Log.debug(f"Sent packet to {len(sent_to)} user(s)")
        else:
            Log.debug("No recipients for packet, didn't send")


def send_packet(sio, users: Union[User, list], name, content, skip_users) \
        -> list:
    """
    Send the packet
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
