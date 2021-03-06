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

// init and configure socket
console.debug(`Connecting to backend: ${BACKEND}`);

// options src: https://socket.io/docs/v4/client-options
export const SOCKET = io(BACKEND, {
  // reconnect every 3 seconds
  randomizationFactor: 0,
  reconnectionDelay: 3000,
  reconnectionDelayMax: 3000,
  timeout: 3000,
});

SOCKET.onAny((name, content) => {
  console.debug("=> RECEIVED:", name, content);
});

// shorthand function for using fetch to send requests to backend
// todo unused?
export function fetchBackend(method, body) {
  fetch(BACKEND, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
  })
    .then((res) => {
      console.debug(`${method} fetch backend ok:`, res);
    })
    .catch((ex) => {
      console.error(`${method} fetch backend error:`, ex);
    });
}
