import { SOCKET } from "./backend";

// send a packet to the backend
export default function sendPacket(name, content) {
  // if socket is disconnected and we try to send, packet will be put on hold
  if (SOCKET.disconnected) {
    // console.warn("Did not send packet: socket disconnected:", name, content);
    // return;
    console.debug(
      "Waiting for connection before sending packet",
      name,
      content
    );
  }

  if (!name) {
    console.warn("Did not send packet: no name given, content:", content);
    return;
  }

  SOCKET.send(name, content);
  console.debug("<= SENT:", name, content);
}
