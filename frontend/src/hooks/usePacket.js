import { useEffect } from "react";
import { SOCKET } from "../utils/backend";

// register a packet handler for a component while it's mounted
// IF different components use the same packet name, put usePacket in App.js!
export default function usePacket(name, handler) {
  useEffect(() => {
    SOCKET.on(name, handler);
    console.debug(`+ added handler: ${name}`);

    return () => {
      SOCKET.off(name);
      console.debug(`- removed handler: ${name}`);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
