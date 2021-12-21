from convenience import *
from user import User


def send_packets_loop(ferdy):
    """
    Blocking loop for sending packets
    """

    set_greenlet_name("PacketSender")
    Log.debug("Send packets loop ready")

    while True:
        users, name, content, packet_id, skip = \
            ferdy.outgoing_packets_queue.get()
        set_greenlet_name(f"PacketSender/#{packet_id}")
        Log.debug(f"Sending packet, {name=}", content=content)

        try:
            sent_to = send_packet(ferdy.sio, users, name, content, skip)

        except Exception as ex:
            Log.error("Unhandled exception on send_packet", ex=ex)
            return

        if sent_to:
            Log.debug(f"Sent packet to {len(sent_to)} user(s)")
        else:
            Log.debug("Did not send packet: no recipients")


def send_packet(sio, users, name, content, skip) -> set:
    """
    Send the packet
    """

    if type(users) == User:
        users = {users}
    elif type(users) == list:
        Log.warning("'users' type is list, should be set")
    elif type(users) == set:
        pass
    else:
        users_type = type(users).__name__
        raise ValueError(f"Invalid 'users' type, {users_type=}")

    if skip:
        if type(skip) == User:
            skip = {skip}
        elif type(skip) == list:
            Log.warning("'skip' type is list, should be set")
        elif type(skip) == set:
            pass
        else:
            skip_type = type(skip).__name__
            raise ValueError(f"Invalid 'skip' type, {skip_type}")

        for user in users.copy():
            if user in skip:
                users.remove(user)

    for user in users:
        # TODO error handling for sio.emit?
        sio.emit(name, content, to=user.sid)

    return users