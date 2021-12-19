from convenience import *


def handle_packets_loop(ferdy):
    """
    Blocking loop for handling incoming packets
    """

    set_greenlet_name("PacketHandler")
    Log.debug("Handle packets loop ready")

    while True:
        user, name, content, packet_id = ferdy.incoming_packets_queue.get()
        set_greenlet_name(f"PacketHandler/#{packet_id}")
        Log.debug(f"Handling packet, {name=}", content=content)

        try:
            instant_response = handle_packet(ferdy, user, name, content)

        except PacketHandlingFailed as ex:
            code = ex.code
            Log.debug(f"Packet handling failed, {code=}")
            instant_response = make_error_packet(code)

        except Exception as ex:
            Log.error("Unhandled exception on handle_packet", ex=ex)
            instant_response = make_error_packet("error.backend")

        if instant_response:
            response_name, response_content = instant_response
            response_packet_id = ferdy.get_next_packet_id()
            Log.debug(f"Handled packet, instant response is "
                      f"#{response_packet_id}")
            ferdy.outgoing_packets_queue.put(
                (user, response_name, response_content, packet_id, None)
            )

        else:
            Log.debug("Handled packet, no instant response")


def handle_packet(ferdy, user, name: str, content: Union[list, dict]) -> tuple:
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

    # only internal frontend/backend errors should be sent to backend
    if name == "error":
        Log.error(f"User sent error: {content['code']}")
        return "error", make_error_packet(content["code"])  # TODO unnecessary?

    # account

    if name == "account.data":
        raise NotImplementedError  # TODO Implement accounts

    if name == "account.list":
        raise NotImplementedError

    # game packets should be handled by game handler
    # TODO implement games

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

    if name == "user.log.in":
        raise NotImplementedError

    if name == "user.log.out":
        raise NotImplementedError

    if name == "user.verify":
        # TODO actually verify???

        Log.debug(f"profileObj {content}")
        token = secrets.token_hex(32)
        return "user.verify.ok", {"token": token}

    if name == "user.message.send":
        raise NotImplementedError

    if name == "user.register":
        raise NotImplementedError

    raise PacketNameUnknown
