import { io } from "socket.io-client";

export const { REACT_APP_BACKEND_URL } = process.env;

export let socket = undefined;

export function connectSocket() {
  if (socket) {
    console.warn("initSocket() ignored: socket already set");
    return;
  }

  console.debug(`Connecting socket, url=${REACT_APP_BACKEND_URL}`);
  
  socket = io(REACT_APP_BACKEND_URL, {
    timeout: 1000,
  });
}

export function sendPacket(name, content) {
  if (socket?.connected) {
    socket.send(name, content);
    console.debug("< SENT", name, content);
    return;
  }

  console.warn("sendPacket() failed: socket not connected");
}

export function fetchBackend(method, body) {
  fetch(REACT_APP_BACKEND_URL, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
  })
    .then((res) => {
      console.debug("fetch() ok", res);
    })
    .catch((ex) => {
      console.error("fetch() error", ex);
    });
}
