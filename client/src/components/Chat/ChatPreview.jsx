import React from "react";
import "../../css/chatStyles/chatpreview.css";

function ChatPreview({ name, lastMessage, image }) {
  return (
    <div className="chat-preview">
      <img className="profile-pic" src={image} alt={`Foto de ${name}`} />
      <div className="info-container">
        <h2>{name}</h2>
        <h3>{lastMessage}</h3>
      </div>
    </div>
  );
}

export default ChatPreview;
