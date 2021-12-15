import { io } from "socket.io-client";

export const { REACT_APP_BACKEND_URL } = process.env;

export let socket = undefined;

export function initSocket() {
  if (socket !== undefined) {
    console.warn("Failed to init socket: socket already set");
    return;
  }

  console.debug(`Initializing socket, backend url: ${REACT_APP_BACKEND_URL}`);
  socket = io(REACT_APP_BACKEND_URL, {
    timeout: 1000,
  });
}

export function sendPacket(packet) {
  if (socket?.connected) {
    socket.send(packet);
    console.debug("Sent packet", packet);
    return;
  }

  console.warn("Failed to send packet: socket not connected");
}
