import React, { useContext } from "react";
import { SubjectTopicContext } from "../contexts/SubjectTopicContext";
import { TimeContext } from "../contexts/TimeContext";
import { ModeContext } from "../contexts/ModeContext";
import { MessageContext } from "../contexts/MessageContext";
import "../css/requestbox.css";

function RequestBox({ avatar }) {
    const { subject, topic } = useContext(SubjectTopicContext);
    const { hour, day } = useContext(TimeContext); 
    const { mode } = useContext(ModeContext);
    const { message } = useContext(MessageContext);
  
    return (
      <div className="request-box">
        <div className="request-header">
          <div className="request-student-info">
            {avatar && ( <img src={avatar} alt="Estudiante" className="student-avatar" />)}
            <span className="subject-topic">{subject} - {topic}</span>
          </div>
          <span className="request-mode">{mode}</span>
        </div>
  
        <div className="request-details">
          <p><strong>Día:</strong> {day} | <strong>Hora:</strong> {hour}</p>
          <p className="request-message">{message}</p>
        </div>
  
        <div className="request-actions">
          <button className="btn-accept">Aceptar</button>
          <button className="btn-decline">Rechazar</button>
        </div>
      </div>
    );
}

export default RequestBox;
  