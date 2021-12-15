import Login from "./components/Login";
import { useEffect } from "react";
import { initSocket, sendPacket, socket } from "./connection";

export default function App() {

  useEffect(() => {
    initSocket();

    socket.on("connect", () => {
      console.log("> connect event");
      sendPacket("packet");
    });

    socket.on("testmessage", (packet) => {
      console.log("> packet", packet);
    });
  }, [])

  return <Login />;
}
