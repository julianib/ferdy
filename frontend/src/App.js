import Login from "./components/Login";
import { useEffect } from "react";
import { connectSocket, disconnectSocket, socket } from "./connection";

export default function App() {
  useEffect(() => {
    connectSocket();

    socket.on("testmessage", (packet) => {
      console.debug("> RECV", packet);
    });

    socket.on("user.verify.ok", (packet) => {
      console.debug("> RECV", packet);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  return <Login />;
}
