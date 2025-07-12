import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubjectTopicContext } from "../../contexts/SubjectTopicContext";
import { ModeContext } from "../../contexts/ModeContext";
import { TimeContext } from "../../contexts/TimeContext";
import { useUser } from "../../contexts/UserContext";
import "../../css/tutorInfoStyles/request.css";
import axios from "axios";

function Request({ onClose, tutor_id }) {
  const { user } = useUser();
  const { subject, topic } = useContext(SubjectTopicContext);
  const { mode } = useContext(ModeContext);
  const { hour, day } = useContext(TimeContext)
  const [ message, setMessage ] = useState("");
  const navigate = useNavigate();

  function handleMessageChange(event) {
    setMessage(event.target.value);
  }

  function handleSubmit() {

    const payload = {
      student_id: user.user_id,
      tutor_id: tutor_id,
      tutorship_subject: subject,
      tutorship_topic: topic,
      tutorship_mode: mode,
      tutorship_hour: hour,
      tutorship_day: day,
      tutorship_request_message: message  
    }
      
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/tutorship/request`, { tutorshipRequestDetails: payload })
    .then(() => {navigate("/chat")})
    .catch((error) => {
      console.error("Error al enviar la solicitud:", error);
    });
  };

  return (
    <div className="request-overlay" onClick={onClose}>
      <div className="request-modal" onClick={(e) => e.stopPropagation()}>
        <button className="request-close" onClick={onClose}>✕</button>

        <h2>Solicitar tutoría</h2>

        <div className="request-field">
          <label>Asignatura</label>
          <select disabled value={subject}>
            <option>{subject}</option>
          </select>
        </div>

        <div className="request-field">
          <label>Tema</label>
          <select disabled value={topic}>
            <option>{topic}</option>
          </select>
        </div>

        <div className="request-field">
          <label>Modalidad</label>
          <select disabled value={mode}>
            <option>{mode}</option> 
          </select>
        </div>

        <div className="request-field">
          <label>En qué necesitas ayuda?</label>
          <textarea 
            placeholder="Describe tu problema o lo que no entiendes..."
            rows={5}
            value={message}
            onChange={handleMessageChange}
          />
        </div>

        <button className="request-submit" onClick={handleSubmit}> Enviar solicitud </button>
      </div>
    </div>
  );
}

export default Request;
