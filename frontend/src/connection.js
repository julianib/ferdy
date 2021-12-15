import { io } from "socket.io-client";

let socket = undefined;

function initSocket() {
  if (socket !== undefined) {
    return;
  }

  console.debug(`Initializing socket, backend url: http://localhost:1962`);
  socket = io("http://localhost:1962", {
    timeout: 1000,
  });
}

function sendPacket(packet) {
  if (socket?.connected) {
    socket.send(packet);
    console.debug("Sent", packet);
    return;
  }

  console.warn("Did not send packet, socket not connected");
}

export { initSocket, sendPacket, socket };
