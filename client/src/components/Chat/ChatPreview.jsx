import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../../css/chatStyles/chatpreview.css";

function ChatPreview({ name,  tutorship_id, lastMessage, image, handleOpenChat, loggedUserRole, otherUserId, needsRating }) {
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
    <div className="chat-preview" onClick={handleOpenChat}>
      <img className="profile-pic" src={image} alt={`Foto de ${name}`} />
      <div className="info-container">
        <h2>{name}</h2>
        <h3>{lastMessage}</h3>
      </div>
  
      <div className="report-container">
        <button className="report-button" onClick={handleUserReport}>Reportar</button>
      </div>
    
      {needsRating && <span className="badge">❗Calificar</span>}
    </div>
  );
}

export default ChatPreview;
