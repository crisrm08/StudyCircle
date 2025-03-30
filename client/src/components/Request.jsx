import React, { useContext } from "react";
import { SubjectTopicContext } from "../contexts/SubjectTopicContext";
import { MessageContext } from "../contexts/MessageContext";
import "../css/request.css";

function Request({ onClose, onSend }) {
  const { subject, topic } = useContext(SubjectTopicContext);
  const { message, setMessage } = useContext(MessageContext);

  function handleSubmit() {
    //onSend({ subject, topic, message });
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
          <label>En qué necesitas ayuda?</label>
          <textarea 
            placeholder="Describe tu problema o lo que no entiendes..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />
        </div>

        <button className="request-submit" onClick={handleSubmit} disabled={!message.trim()}> Enviar solicitud </button>
      </div>
    </div>
  );
}

export default Request;
