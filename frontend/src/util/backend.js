import { io } from "socket.io-client";

const HOSTNAME = window.location.hostname;

// get backend related environment variables
const {
  REACT_APP_BACKEND_CUSTOM,
  REACT_APP_BACKEND_HTTPS,
  REACT_APP_BACKEND_PORT,
} = process.env;

// if a custom url is set, use that url
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
SOCKET.onAny((name, content) => {
  console.debug("=> RECEIVED:", name, content);
});
SOCKET.on("connect", () => {
  console.debug("Socket connected");
});
SOCKET.on("connect_error", (error) => {
  console.warn("Socket connect failed");
});
SOCKET.on("disconnect", (reason) => {
  console.debug("Socket disconnected:", reason);
});

// shorthand function for using fetch to send requests to backend
// export function fetchBackend(method, body) {
//   fetch(BACKEND, {
//     method: method,
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ body }),
//   })
//     .then((res) => {
//       console.debug("fetch backend ok:", res);
//     })
//     .catch((ex) => {
//       console.error("fetch backend error:", ex);
//     });
// }
