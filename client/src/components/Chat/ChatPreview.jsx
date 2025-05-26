import React from "react";
import "../../css/chatStyles/chatpreview.css";

function ChatPreview({ name, lastMessage, image, handleOpenChat }) {
  
  return (
    <div className="chat-preview" onClick={handleOpenChat}>
      <img className="profile-pic" src={image} alt={`Foto de ${name}`} />
      <div className="info-container">
        <h2>{name}</h2>
        <h3>{lastMessage}</h3>
      </div>
    </div>
  );
}

export default ChatPreview;
