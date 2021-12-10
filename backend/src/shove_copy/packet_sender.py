from convenience import *

from user import User


def send_packets_loop(shove, sio: socketio.Server):
    """Blocking loop for sending packets (that were added to the queue)"""

    set_greenlet_name("PacketSender")
    Log.trace("Send packets loop ready")

    while True:
        users, model, packet, skip, packet_id = shove.outgoing_packets_queue.get()
        set_greenlet_name(f"PacketSender/#{packet_id}")
        Log.debug(f"Sending packet #{packet_id}: '{model}'", packet=packet)
        # start_time = time.time()
        # Log.test(f"start {time.time()}")

        try:
            sent_to = send_packet(sio, users, model, packet, skip)

        except Exception as ex:
            Log.critical("Unhandled exception on send_packet", ex=ex)

        else:
            if sent_to:
                # Log.test(f"end {time.time()}")
                # elapsed = time.time() - start_time
                Log.trace(f"Sent '{model}' to {len(sent_to)} user(s)\n to: {sent_to}")
            else:
                Log.trace(f"No recipients for '{model}'")


def send_packet(sio: socketio.Server, users: Union[User, Set[User]], model: str,
                packet: Union[dict, list], skip: Union[User, Set[User]]) -> set:
    """Actually sends the packet through SocketIO.
    Returns the amount of users the packet was sent to"""

    if type(users) == User:
        users = [users]

    elif type(users) == set:
        pass

    else:
        raise ValueError(f"Invalid 'users' type: {type(users).__name__}")

    if skip:
        if type(skip) == User:
            skip = [skip]

        elif type(skip) == set:
            pass

        else:
            raise ValueError(f"Invalid 'skip' type: {type(users).__name__}")

        for skip_user in skip:
            users.remove(skip_user)

    for user in users:
        sio.emit(model, packet, to=user.sid)

    return users
