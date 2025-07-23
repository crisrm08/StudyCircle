import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../../css/chatStyles/chatpreview.css";

function ChatPreview({ name,  tutorship_id, lastMessage, image, handleOpenChat, loggedUserRole, otherUserId, needsRating }) {
  const hasNewMessage = true;
  const [isTutorshipOver, setIsTutorshipOver] = useState(true);
  const navigate = useNavigate();

  function handleUserReport() {
    navigate(`/report/${tutorship_id}/${otherUserId}`);
  }

  function requestNewTutorship() {
    console.log("Not fully implemented yet");
    //navigate(`/tutor-facts/${tutor_id}`);
  }
  
  return (
     <div 
      className={`chat-preview ${hasNewMessage ? 'highlight' : ''}`} 
      onClick={handleOpenChat}
      style={{ position: "relative" }}
      >
        <img className="profile-pic" src={image} alt={`Foto de ${name}`} />
        <div className="info-container">
          <h2>{name}</h2>
          <h3>{lastMessage}</h3>
        </div>
    
        <div className="report-container">
          <button className="report-button" onClick={handleUserReport}>Reportar</button>
        </div>
      
        {needsRating && <span className="badge">❗Calificar</span>}
        {/* simulamos “mensaje nuevo” con otro badge */}
        {hasNewMessage && (
          <span className="notification-dot" style={{ top: 10, right: 10 }} />
        )}
    </div>
  );
}

export default ChatPreview;
