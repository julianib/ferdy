import { useEffect } from "react";
import { io } from "socket.io-client";

const HOSTNAME = window.location.hostname;

// get backend environment variables
const {
  REACT_APP_BACKEND_CUSTOM,
  REACT_APP_BACKEND_HTTPS,
  REACT_APP_BACKEND_PORT,
} = process.env;

// if custom url is set, use that url
// if no custom url is set, check if https is enabled or disabled
// then set the url
export const BACKEND = REACT_APP_BACKEND_CUSTOM
  ? REACT_APP_BACKEND_CUSTOM
  : REACT_APP_BACKEND_HTTPS === "true"
  ? `https://${HOSTNAME}:${REACT_APP_BACKEND_PORT}`
  : `http://${HOSTNAME}:${REACT_APP_BACKEND_PORT}`;

// socketio setup:

// init socket
console.debug(`Connecting socket, backend=${BACKEND}`);
export const SOCKET = io(BACKEND);

// add connection event listeners
SOCKET.onAny((data, data2) => {
  console.debug("=> RECEIVED:", data, data2);
});
SOCKET.on("connect", () => {
  console.debug("Socket connected");
});
SOCKET.on("disconnect", (data) => {
  console.debug("Socket disconnected:", data);
});
SOCKET.on("error", (ex) => {
  console.debug("Socket error:", ex);
});

// packet related functions:

// register a packet handler for a component, and unregister it if it unmounts
export function usePacket(name, handler) {
  useEffect(() => {
    SOCKET.on(name, handler);
    console.debug(`+ added packet handler: ${name}`);

    return () => {
      SOCKET.off(name);
      console.debug(`- removed packet handler: ${name}`);
    };

    // TODO prevent react missing dependencies warning
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

// send a packet to the backend
export function sendPacket(name, content) {
  // make sure we are connected - if this check is absent, all unsent packets
  // get sent instantly as soon as we reconnect
  if (SOCKET.disconnected) {
    console.warn("Did not send packet: socket disconnected");
    return;
  }

  SOCKET.send(name, content);
  console.debug("<= SENT:", name, content);
}

// non-socketio backend functions:

// shorthand function for using fetch to send requests to backend
export function fetchBackend(method, body) {
  fetch(BACKEND, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
  })
    .then((res) => {
      console.debug("fetch backend ok:", res);
    })
    .catch((ex) => {
      console.error("fetch backend error:", ex);
    });
}
