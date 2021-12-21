import { io } from "socket.io-client";

// this object gets returned by getSocket()
let socket = null;

// get environment variables
const {
  REACT_APP_BACKEND_CUSTOM,
  REACT_APP_BACKEND_HTTPS,
  REACT_APP_BACKEND_PORT,
} = process.env;

const domain = window.location.hostname;

export function getBackendUrl() {
  // if custom url is set, use that url
  // if no custom url is set, check if https is enabled or disabled
  // then set the url
  if (REACT_APP_BACKEND_CUSTOM) {
    return REACT_APP_BACKEND_CUSTOM;
  }

  if (REACT_APP_BACKEND_HTTPS === "true") {
    return `https://${domain}:${REACT_APP_BACKEND_PORT}`;
  }

  return `http://${domain}:${REACT_APP_BACKEND_PORT}`;
}

export function getSocket() {
  // socket is already was already initialized by another component, so just
  // return the already-initialized socket instance to use
  if (socket) {
    return socket;
  }

  const backendUrl = getBackendUrl();

  console.debug(`Connecting socket, url=${backendUrl}`);

  socket = io(backendUrl, {
    timeout: 1000,
  });

  socket.prependAny((data, data2) => {
    console.debug("=> RECEIVED:", data, data2);
  });

  socket.on("connect", () => {
    console.debug("Socket connected");
  });

  socket.on("disconnect", (data) => {
    console.debug("Socket disconnected:", data);
  });

  socket.on("error", (ex) => {
    console.debug("Socket error", ex);
  });

  socket.on("reconnect", (data) => {
    console.debug("Socket reconnected", data);
  });

  socket.on("reconnect_attempt", (data) => {
    console.debug("Socket reconnecting", data);
  });

  socket.on("reconnect_error", (ex) => {
    console.debug("Socket reconnect error", ex);
  });

  return socket;
}

export function disconnectSocket() {
  if (!socket.connected) {
    console.warn("Could not disconnect socket: not connected");
    return;
  }

  socket.disconnect();
  // remove all listeners for proper cleanup
  socket.offAny();
  socket = null;

  // TODO not working????????
  console.debug("Disconnected socket and removed listeners");
}

export function sendPacket(name, content) {
  // only send packets if the socket is connected
  if (socket?.connected) {
    socket.send(name, content);
    console.debug("<= SENT:", name, content);
    return;
  }

  console.warn("sendPacket() failed: socket not connected");
}

export function fetchBackend(method, body) {
  // shorthand function for using fetch to send requests to backend

  fetch(getBackendUrl(), {
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
