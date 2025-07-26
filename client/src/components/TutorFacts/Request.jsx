import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubjectTopicContext } from "../../contexts/SubjectTopicContext";
import { ModeContext } from "../../contexts/ModeContext";
import { TimeContext } from "../../contexts/TimeContext";
import { useUser } from "../../contexts/UserContext";
import "../../css/tutorInfoStyles/request.css";
import axios from "axios";

function Request({ onClose, tutor_id, tutorshipSubject, tutorshipTopic, tutorshipMode}) {
  const { user } = useUser();
  const navigate = useNavigate();
  const { subject: ctxSubject, topic: ctxTopic } = useContext(SubjectTopicContext);
  const { mode: ctxMode } = useContext(ModeContext);
  const { hour, day } = useContext(TimeContext);
  const [message, setMessage] = useState("");

  
  const finalSubject = tutorshipSubject || ctxSubject;
  const finalTopic = tutorshipTopic || ctxTopic;
  const finalMode = tutorshipMode || ctxMode;

  function handleMessageChange(event) {
    setMessage(event.target.value);
  }

  async function handleSubmit() {
    if (!user) {
      navigate("/login");
      return;
    }

    const payload = {
      student_id: user.user_id,
      tutor_id,
      tutorship_subject: finalSubject,
      tutorship_topic: finalTopic,
      tutorship_mode: finalMode,
      tutorship_hour: hour,
      tutorship_day: day,
      tutorship_request_message: message
    };

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tutorship/request`,
        { tutorshipRequestDetails: payload }
      );
      if (ctxTopic) {
        navigate("/chat");
      }
      else{
        navigate(0);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert("No se pudo enviar la solicitud. Intenta de nuevo.");
    }
  }

  return (
    <div className="request-overlay" onClick={onClose}>
      <div className="request-modal" onClick={(e) => e.stopPropagation()}>
        <button className="request-close" onClick={onClose}>✕</button>

        <h2>Solicitar tutoría</h2>

        <div className="request-field">
          <label>Asignatura</label>
          <select disabled value={finalSubject || ""}>
            <option>{finalSubject || "-"}</option>
          </select>
        </div>

        <div className="request-field">
          <label>Tema</label>
          <select disabled value={finalTopic || ""}>
            <option>{finalTopic || "-"}</option>
          </select>
        </div>

        <div className="request-field">
          <label>Modalidad</label>
          <select disabled value={finalMode || ""}>
            <option>{finalMode || "-"}</option>
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
