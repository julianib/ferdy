import { SOCKET } from "./backend";

// send a packet to the backend
export default function sendPacket(name, content, wait_for_connection = false) {
  if (SOCKET.disconnected) {
    if (wait_for_connection) {
      // wait for connection and then send the packet instantly
      console.debug("Waiting for connection for packet:", name);
    } else {
      // if socket is disconnected, packet will be DISCARDED
      console.debug("Not waiting for connection for packet:", name);
      return;
    }
  }

  if (!name) {
    console.error("Did not send packet: no name given, content:", content);
    return;
  }

  SOCKET.send(name, content);
  console.debug("<= SENT:", name, content);
}
