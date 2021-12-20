import Login from "./components/Login";
import { useEffect, useContext } from "react";
import { getSocket, disconnectSocket } from "./connection";
import { UserContext } from "./contexts/UserContext";
import ChatBox from "./components/ChatBox";

export default function App() {
  const { user } = useContext(UserContext);

  useEffect(() => {
    getSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <>
      {user ? <h1>{user.first_name}</h1> : <h1>Not logged in</h1>}
      <Login />
      <ChatBox />
    </>
  );
}
