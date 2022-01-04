import { useEffect } from "react";
import { SOCKET } from "../util/backend";

// register a packet handler for a component while it's mounted
// IF different components use the same packet name, put usePacket in App.js!
export function usePacket(name, handler) {
  useEffect(() => {
    SOCKET.on(name, handler);
    console.debug(`+ added handler: ${name}`);

    return () => {
      SOCKET.off(name);
      console.debug(`- removed handler: ${name}`);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

// register the same handler for multiple packets
export function usePackets(names = [], handler) {
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
