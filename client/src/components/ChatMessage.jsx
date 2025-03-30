import React from "react";
import "../css/chatmessage.css";

function ChatMessage({ text, isOwn }) {
  return (
    <div className={`chat-message ${isOwn ? "own-message" : "other-message"}`}>
      <p>{text}</p>
    </div>
  );
}

export default ChatMessage;
