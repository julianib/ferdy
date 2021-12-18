import Login from "./components/Login";
import { useEffect } from "react";
import { connectSocket, sendPacket, socket } from "./connection";

export default function App() {
  useEffect(() => {
    connectSocket();

    socket.on("connect", (data) => {
      console.debug("> connected", data);
      sendPacket("yo");
    });

    socket.on("disconnect", (data) => {
      console.debug("> disconnected", data);
    });

    socket.on("testmessage", (packet) => {
      console.debug("> RECV", packet);
    });

    socket.on("user.verify.ok", (packet) => {
      console.debug("> RECV", packet);
    });
  }, []);

  return <Login />;
}
