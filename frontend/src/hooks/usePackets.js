import { useEffect } from "react";
import { SOCKET } from "../utils/backend";

// register the same handler for multiple packets
export default function usePackets(names = [], handler) {
  useEffect(() => {
    names.forEach((name) => {
      SOCKET.on(name, handler);
      console.debug(`+ added handler: ${name}`);
    });

    return () => {
      names.forEach((name) => {
        SOCKET.off(name);
        console.debug(`- removed handler: ${name}`);
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
