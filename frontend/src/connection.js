import { io } from "socket.io-client";

export const { REACT_APP_BACKEND_URL } = process.env;

export let socket = null;

export function connectSocket() {
  if (socket) {
    console.warn("initSocket() ignored: socket already set");
    return;
  }

  console.debug(`Connecting socket, url=${REACT_APP_BACKEND_URL}`);

  socket = io(REACT_APP_BACKEND_URL, {
    timeout: 1000,
  });

  socket.onAny((data, data2) => {
    console.debug("> GOT", data, data2);
  });

  socket.on("connect", (data) => {
    console.debug("Socket connected", data);
    sendPacket("yo");
  });

  socket.on("disconnect", (data) => {
    console.debug("Socket disconnected:", data);
  });

  // this built in event is shadowing "error" packets from backend, so skip
  // socket.on("error", (ex) => {
  //   console.debug("Socket error", ex);
  // });

  socket.on("reconnect", (data) => {
    console.debug("Socket reconnected", data);
  });

  socket.on("reconnect_attempt", (data) => {
    console.debug("Socket reconnecting", data);
  });

  socket.on("reconnect_error", (ex) => {
    console.debug("Socket reconnect error", ex);
  });
}

export function disconnectSocket() {
  if (!socket.connected) {
    console.warn("Could not disconnect socket: not connected");
    return;
  }

  socket.disconnect();
  // remove all listeners for proper cleanup
  socket.removeAllListeners();
  socket = null;

  // TODO not working????????
  console.debug("Disconnected socket and removed listeners");
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
