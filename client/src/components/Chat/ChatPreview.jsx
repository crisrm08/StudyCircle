import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../../css/chatStyles/chatpreview.css";

function ChatPreview({ name, lastMessage, image, handleOpenChat, loggedUserRole, otherUserId }) {
  const [isTutorshipOver, setIsTutorshipOver] = useState(true);
  const navigate = useNavigate();
  loggedUserRole = "tutor";

  function handleUserReport() {
    navigate(`/report/${otherUserId}`);
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
      {isTutorshipOver && loggedUserRole === "student" ? (
        <div className="report-container">
          <button className="request-tutorship-button" onClick={requestNewTutorship}> Solicitar otra tutoría </button>
        </div>
      ):(
        <div className="report-container">
          <button className="report-button" onClick={handleUserReport}>Reportar</button>
        </div>
      )}
    </div>
  );
}

export default ChatPreview;
