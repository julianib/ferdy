import { useState } from "react";
import usePacket from "../hooks/usePacket";

const MAX_CHAT_MESSAGES = 5;

export default function useChatMessages() {
  // todo should use context
  const [chatMessages, setChatMessages] = useState([]);

  // packet handler to add incoming messages to the list of messages
  usePacket("user.receive_message", (content) => {
    addChatMessage(content);
  });

  // drop errors in the chatbox
  usePacket("user.send_message.error", ({ text }) => {
    addChatMessage({ text });
  });

  function addChatMessage(chatMessage) {
    setChatMessages((oldState) => {
      // add the new chat message to the old array
      let newState = [...oldState, chatMessage];

      // if array size exceeds MAX, slice it to reduce its size to MAX
      if (newState.length + 1 > MAX_CHAT_MESSAGES) {
        newState = newState.slice(-MAX_CHAT_MESSAGES);
      }

      // set the state to the new value
      return newState;
    });
  }

  // todo removing a message should get the least old message from backend
  // to keep the amount of messages always at MAX items
  function removeChatMessage(text) {
    setChatMessages((oldState) => {
      // filter out the chat message to remove
      const newState = oldState.filter((item) => {
        return item.text !== text;
      });

      return newState;
    });
  }

  return { chatMessages, addChatMessage, removeChatMessage };
}
