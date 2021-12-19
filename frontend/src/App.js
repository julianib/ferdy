import Login from "./components/Login";
import { SocketContext } from "./SocketContext";
import { useEffect, useContext } from "react";
import { connectSocket, disconnectSocket } from "./connection";

export default function App() {
  const { socket, setSocket } = useContext(SocketContext);

  // setInterval(() => {
  //   console.debug("socket currently", socket);
  // }, 1000);

  useEffect(() => {
    let newSocket = connectSocket()
    setSocket(newSocket)
    

    console.debug("App() useEffect", socket);

    return () => {
      disconnectSocket();
    };
  }, [socket, setSocket]);

  return socket?.connected ? <Login /> : null;
}
