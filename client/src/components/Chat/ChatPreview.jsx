import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../../css/chatStyles/chatpreview.css";

function ChatPreview({ name,  tutorship_id, lastMessage, image, status, handleOpenChat, loggedUserRole, otherUserId, needsRating, hasNewMessage }) {
  const [isTutorshipOver, setIsTutorshipOver] = useState(true);
  const navigate = useNavigate();

  function handleUserReport() {
    navigate(`/report/${tutorship_id}/${otherUserId}`);
  }
  
  return (
     <div 
      className={`chat-preview ${(hasNewMessage || (status === "finished" && needsRating)) ? 'highlight' : ''}`} 
      onClick={handleOpenChat}
      style={{ position: "relative" }}
      >
        <img className="profile-pic" src={image} alt={`Foto de ${name}`} />
        <div className="info-container">
          <h2>{name}</h2>
          <h3>{lastMessage}</h3>
        </div>
    
        <div className="report-container">
          {status !== "pending" && (
            <button className="report-button" onClick={handleUserReport}>Reportar</button>
          )}
          {status === "pending" && (
            <span className="waiting-badge">Esperando respuesta...</span>
          )}
        </div>
      
        {hasNewMessage && (
          <span className="notification-dot" style={{ top: 10, right: 10 }} />
        )}
        {(needsRating && status === "finished") && <span className="badge">❗Calificar</span>}
    </div>
  );
}

export default ChatPreview;
