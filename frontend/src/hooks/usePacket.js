import { useEffect } from "react";
import { SOCKET } from "../util/backend";

// hook, register a packet handler for a component while it's mounted
export default function usePacket(name, handler) {
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
