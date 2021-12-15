// import { useEffect } from "react";
import Login from "./components/Login";
import { initSocket, sendPacket, socket } from "./connection";

let isConnected = false;

export default function App() {
  // useEffect(() => {  // multiple connections for
  //   initSocket();
  // }, [])

  if (!isConnected) {
    isConnected = true;
    initSocket();

    socket.on("connect", () => {
      console.log("> connect event");
      sendPacket("packet");
    });

    socket.on("testmessage", (packet) => {
      console.log("> packet", packet);
    });
  }

  return <Login />;
}
