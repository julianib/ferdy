import { useContext, useState } from "react";
import useChatMessages from "../hooks/useChatMessages";
import ChatMessage from "./ChatMessage";
import sendPacket from "../util/sendPacket";
import { UserContext } from "../contexts/UserContext";

const classes = {
  messagesList: {},
};

export default function ChatBox() {
  const { chatMessages } = useChatMessages();
  // const { user } = useUser();
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
