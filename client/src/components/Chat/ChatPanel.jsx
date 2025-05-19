import React, { useContext } from "react";
import ChatMessage from "./ChatMessage";
import SessionControlBar from "./SessionControlBar";
import { SubjectTopicContext } from "../../contexts/SubjectTopicContext";
import { ModeContext } from "../../contexts/ModeContext";
import { IoSend } from "react-icons/io5";
import "../../css/chatStyles/chatpanel.css";

function ChatPanel({ image, name }) {
  const { subject, topic } = useContext(SubjectTopicContext);
  const { mode } = useContext(ModeContext);

  return (
    <div className="chat-panel">
      <div className="top-panel">
        <div className="left-side">
          <img className="profile-pic" src={image} alt={`Foto de ${name}`} />
          <div>
            <h2>{name}</h2>
            <p className="subject-info">{subject} • {topic} • {mode}</p>
          </div>
        </div>
      </div>

      <div className="messages-container">
        <ChatMessage text="Hola, muchas gracias por tu ayuda" isOwn={false} />
        <ChatMessage text="¡Con gusto! ¿Tienes alguna otra duda?" isOwn={true} />
        <ChatMessage text="Eso era todo" isOwn={false} />
      </div>

      <SessionControlBar />

      <div className="input-message-container">
        <input type="text" placeholder="Escribe un mensaje..." />
        <button className="send-button">
          <IoSend />
        </button>
      </div>
    </div>
  );
}

export default ChatPanel;
