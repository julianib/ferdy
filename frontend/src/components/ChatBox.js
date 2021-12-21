import { useContext, useState } from "react";
import { sendPacket } from "../backend";

import { UserContext } from "../contexts/UserContext";
import useChatMessages from "../hooks/useChatMessages";
import ChatMessage from "./ChatMessage";

const classes = {
  messagesList: {},
};

export default function ChatBox() {
  const { chatMessages } = useChatMessages();
  const { user } = useContext(UserContext);
  const [messageInput, setMessageInput] = useState("");

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

  return (
    <div>
      <ul styles={classes.messagesList}>
        {chatMessages.map((message, i) => {
          return <ChatMessage key={i} {...message} />;
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
