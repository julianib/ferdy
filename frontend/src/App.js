import Login from "./components/Login";
import ChatBox from "./components/ChatBox";
import { useContext, useEffect, useState } from "react";
import useChatMessages from "./hooks/useChatMessages";
import ChatMessage from "./components/ChatMessage";
import { UserContext } from "./contexts/UserContext";

export default function App() {
  // const { user } = useUser(); // broken wtffffffff
  const { user } = useContext(UserContext);
  const [test, setTest] = useState(0);
  const { chatMessages } = useChatMessages();

  useEffect(() => {
    console.debug("useEffect App", user);
  });

  return (
    <>
      {user ? <h1>{user.first_name}</h1> : <h1>Not logged in</h1>}
      <Login />
      <ChatBox />
      {user?.name || "no user set"}
      <button
        onClick={() => {
          setTest((oldState) => oldState + 1);
        }}
      >
        click to update App(){test}
      </button>
      <br />
      <ul>
        {chatMessages.map((chatMessage, i) => {
          return <ChatMessage key={i} {...chatMessage} />;
        })}
      </ul>
    </>
  );
}
