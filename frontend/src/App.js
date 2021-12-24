import Login from "./components/Login";
import ChatBox from "./components/ChatBox";
import useUser from "./hooks/useUser";

export default function App() {
  const { user } = useUser();

  return (
    <>
      {user ? <h1>{user.first_name}</h1> : <h1>Not logged in</h1>}
      <Login />
      <ChatBox />
      {user?.name || "no user set"}
    </>
  );
}
