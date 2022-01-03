import { SOCKET } from "./backend";

// send a packet to the backend
export default function sendPacket(name, content) {
  // if this check is absent all unsent packets get sent instantly as soon as
  // we reconnect
  if (SOCKET.disconnected) {
    console.warn("Did not send packet: socket disconnected:", name, content);
    return;
  }

  if (!name) {
    console.warn("Did not send packet: no name given, content:", content);
    return;
  }

  SOCKET.send(name, content);
  console.debug("<= SENT:", name, content);
}
