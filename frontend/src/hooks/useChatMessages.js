import { useState } from "react";

const MAX_CHAT_MESSAGES = 5;

export default function useChatMessages() {
  const [chatMessages, setChatMessages] = useState([]);

  function addChatMessage(chatMessage) {
    // add the chat message to the current array
    let newChatMessages = [...chatMessages, chatMessage];

    // if array size exceeds MAX, slice it to reduce its size to MAX
    if (newChatMessages.length + 1 > MAX_CHAT_MESSAGES) {
      newChatMessages = newChatMessages.slice(-MAX_CHAT_MESSAGES);
    }

    setChatMessages(newChatMessages);
  }

  // TODO removing a message should get the least old message from backend
  // to keep the amount of messages always at MAX items
  function removeChatMessage(chatMessage) {
    // filter out the chat message to remove
    const newChatMessages = chatMessages.filter((item) => {
      return item !== chatMessage;
    });

    setChatMessages(newChatMessages);
  }

  return { chatMessages, addChatMessage, removeChatMessage };
}
