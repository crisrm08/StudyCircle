import React, { useContext, useState } from "react";
import {useNavigate} from "react-router-dom";
import ChatMessage from "./ChatMessage";
import SessionControlBar from "./SessionControlBar";
import { SubjectTopicContext } from "../../contexts/SubjectTopicContext";
import { ModeContext } from "../../contexts/ModeContext";
import { IoSend } from "react-icons/io5";
import { MdKeyboardArrowLeft, MdHourglassEmpty } from "react-icons/md";
import "../../css/chatStyles/chatpanel.css";

function ChatPanel({ image, name, hideChatPanel }) {
  const { subject, topic } = useContext(SubjectTopicContext);
  const { mode } = useContext(ModeContext);
  const [isTutorshipAccepted, setTutorshipAccepted] = useState(true); 
  const navigate = useNavigate();

  function handleProfileClick() {
    navigate("/student-profile");
  }

  return (
    <div className="chat-panel">
      <div className="top-panel">
            <div className="left-side">
              <MdKeyboardArrowLeft size={40} color="#163172" className="chat-go-back" onClick={hideChatPanel}/>
              <img className="profile-pic" src={image} alt={`Foto de ${name}`} onClick={handleProfileClick}/>
              <div>
                <h2>{name}</h2>
                <p className="subject-info">{subject} • {topic} • {mode}</p>
              </div>
            </div>
      </div>
      {isTutorshipAccepted === false ? (
        <div className="tutorship-notification">
          <MdHourglassEmpty size={48} color="#163172" style={{ marginBottom: 12 }} />
          <h2>¡Solicitud enviada!</h2>
          <p>Tu solicitud de tutoría ha sido enviada a tu tutor. Te avisaremos cuando tu tutor acepte la solicitud. ¡Gracias por confiar en StudyCircle!</p>
          <button className="cancel-tutorship-button subtle" onClick={() => setTutorshipAccepted(false)}>
            Cancelar solicitud
          </button>
        </div>
      ) : (
        <>
          <div className="messages-container">
            <ChatMessage text="Hola, muchas gracias por tu ayuda" isOwn={false} />
            <ChatMessage text="¡Con gusto! ¿Tienes alguna otra duda?" isOwn={true} />
            <ChatMessage text="Eso era todo" isOwn={false} />
            <ChatMessage text="¡Perfecto! Si tienes más dudas, no dudes en escribirme" isOwn={true} />
            <ChatMessage text="¡Gracias!" isOwn={false} />  
            <ChatMessage text="¡Gracias!" isOwn={false} />  
            <ChatMessage text="¡Gracias!" isOwn={false} />  
            <ChatMessage text="¡Gracias!" isOwn={false} />  
              <ChatMessage text="¡Gracias!" isOwn={false} /> 
                <ChatMessage text="¡Gracias!" isOwn={false} /> 
                  <ChatMessage text="¡Gracias!" isOwn={false} /> 
          </div>

          <div className="bottom-bar-container">
            <SessionControlBar />
            <div className="input-message-container">
              <input type="text" placeholder="Escribe un mensaje..." />
              <button className="send-button">
                <IoSend />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatPanel;
