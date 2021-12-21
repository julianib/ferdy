import { SOCKET } from "./backend";

// send a packet to the backend
export default function sendPacket(name, content) {
  // make sure we are connected - if this check is absent, all unsent packets
  // get sent instantly as soon as we reconnect
  if (SOCKET.disconnected) {
    console.warn("Did not send packet: socket disconnected");
    return;
  }

  SOCKET.send(name, content);
  console.debug("<= SENT:", name, content);
}
