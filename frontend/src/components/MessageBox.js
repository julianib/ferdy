import { useContext, useEffect, useState } from "react";
import { getSocket, sendPacket } from "../connection";
import { MessagesContext } from "../contexts/MessagesContext";
import { UserContext } from "../contexts/UserContext";

export default function MessageBox() {
  const { messages, setMessages } = useContext(MessagesContext);
  const { user } = useContext(UserContext);
  const [messageInput, setMessageInput] = useState("");

  function addMessage(message) {
    setMessages([...messages, message]);
  }

  function onInputChange(e) {
    setMessageInput(e.target.value);
  }

  function onSubmit(e) {
    sendPacket("user.message.send", {
      author: user.name,
      text: messageInput,
    });
    setMessageInput("");
    e.preventDefault();
  }

  useEffect(() => {
    let socket = getSocket();

    socket.on("user.message.receive", (content) => {
      addMessage({ ...content });
    });

    return () => {
      socket.off("user.message.receive");
    };
  });

  return (
    <div>
      <ul>
        {messages.map((message, i) => {
          return (
            <li key={i}>
              <b>{message.author}</b>: {message.text}
            </li>
          );
        })}
      </ul>
      {user ? (
        <form onSubmit={onSubmit}>
          <input
            type="textarea"
            onChange={onInputChange}
            value={messageInput}
            placeholder="Type Here..."
            autoFocus
          />
        </form>
      ) : null}
    </div>
  );
}
