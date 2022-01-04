import { SOCKET } from "./backend";

// send a packet to the backend
export default function sendPacket(name, content) {
  if (SOCKET.disconnected) {
    // if socket is disconnected and we try to send, packet will be put on hold
    console.debug("Awaiting connection for packet", name, content);

    // console.warn("Did not send packet: socket disconnected:", name, content);
    // return;
  }

  if (!name) {
    console.warn("Did not send packet: no name given, content:", content);
    return;
  }

  SOCKET.send(name, content);
  console.debug("<= SENT:", name, content);
}
