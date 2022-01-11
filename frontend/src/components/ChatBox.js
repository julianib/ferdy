import { useState } from "react";
import useChatMessages from "../hooks/useChatMessages";
import useProfile from "../hooks/useProfile";
import ChatMessage from "./ChatMessage";

export default function ChatBox() {
  // todo outdated
  // todo rename to MessageBox

  const { chatMessages, sendChatMessage } = useChatMessages();
  const { profile } = useProfile();

  const [messageInput, setMessageInput] = useState("");

  function onInputChange(e) {
    setMessageInput(e.target.value);
  }

  function onSubmit(e) {
    sendChatMessage(profile.name, messageInput);
    setMessageInput("");
    e.preventDefault();
  }

  return (
    <div>
      <ul>
        {chatMessages.map((message, i) => {
          return <ChatMessage key={i} {...message} />;
        })}
      </ul>
      {profile && (
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
