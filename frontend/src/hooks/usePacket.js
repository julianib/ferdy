import { useEffect } from "react";
import { SOCKET } from "../util/backend";

// register a packet handler for a component while it's mounted
export function usePacket(name, handler) {
  useEffect(() => {
    SOCKET.on(name, handler);
    console.debug(`+ added packet handler: ${name}`);

    return () => {
      SOCKET.off(name);
      console.debug(`- removed packet handler: ${name}`);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

// register the same handler for multiple packets
export function usePackets(names = [], handler) {
  useEffect(() => {
    names.forEach((name) => {
      SOCKET.on(name, handler);
      console.debug(`+ added packet handler: ${name}`);
    });

    return () => {
      names.forEach((name) => {
        SOCKET.off(name);
        console.debug(`- removed packet handler: ${name}`);
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
