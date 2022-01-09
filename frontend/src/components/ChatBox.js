import { useState } from "react";
import useChatMessages from "../hooks/useChatMessages";
import ChatMessage from "./ChatMessage";
import sendPacket from "../utils/sendPacket";
import useUser from "../hooks/useUser";
import usePacket from "../hooks/usePacket";
import useToast from "../hooks/useToast";

const classes = {
  messagesList: {},
};

export default function ChatBox() {
  // todo outdated

  const { chatMessages } = useChatMessages();
  const { user } = useUser();
  const { openToast } = useToast();

  const [messageInput, setMessageInput] = useState("");

  function onInputChange(e) {
    setMessageInput(e.target.value);
  }

  function onSubmit(e) {
    sendPacket("user.send_message", {
      author: user.name,
      text: messageInput,
    });
    setMessageInput("");
    e.preventDefault();
  }

  usePacket("user.send_message.error", (content) => {
    openToast(`Couldn't send message: ${content.error}`, "error");
  });

  return (
    <div>
      <ul styles={classes.messagesList}>
        {chatMessages.map((message, i) => {
          return <ChatMessage key={i} {...message} />;
        })}
      </ul>
      {user && (
        <form onSubmit={onSubmit}>
          <input
            type="textarea"
            onChange={onInputChange}
            value={messageInput}
            placeholder="Type Here..."
            autoFocus
          />
        </form>
      )}
    </div>
  );
}
