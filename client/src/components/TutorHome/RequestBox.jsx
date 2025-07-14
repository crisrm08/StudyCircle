import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../../css/tutorHomeStyles/requestbox.css";
import { useEffect } from "react";
import axios from "axios";

function RequestBox(requestDetails) {
  const navigate = useNavigate();
  const [rejected, setRejected] = useState(false);
  const { tutorship_request_id, student_id, student_avatar, tutorship_subject, tutorship_topic, tutorship_mode, tutorship_day, tutorship_hour, tutorship_request_message } = requestDetails.requestDetails;

  useEffect(() => {
    console.log(requestDetails) ;
  })

  function handleDecline() {
    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/tutorship/request/${tutorship_request_id}`)
      .then(() => setRejected(true))
      .catch(console.error);
  }

  function handleAccept() {
    axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/tutorship/requests/${tutorship_request_id}/accept`
    )
    .then(() => {
    
      navigate("/chat", { state: { selectedChatId: tutorship_request_id } });
    })
    .catch(console.error);
  }


  function seeStudentProfile() {
    navigate(`/student-facts/${student_id}`);
  }

  if (rejected) return null;
  
  return (
    <div className="request-box">
      <div className="request-header">
        <div className="request-student-info">
          <img src={student_avatar} alt="Estudiante" className="student-avatar" onClick={seeStudentProfile}/>
          <span className="subject-topic"> {tutorship_subject} - {tutorship_topic} </span>
        </div>
        <span className="request-mode">{tutorship_mode}</span>
      </div>

      <div className="request-details">
        <p>
          <strong>Día:</strong> {(!tutorship_day) ? "Por decidir" : tutorship_day} | <strong>Hora:</strong> {(!tutorship_hour) ? "Por decidir" : tutorship_hour}
        </p>
        <p className="request-message">{tutorship_request_message}</p>
      </div>

      <div className="request-actions">
        <button className="btn-accept" onClick={handleAccept}>Aceptar</button>
        <button className="btn-decline" onClick={handleDecline}> Rechazar </button>
      </div>
    </div>
  );
}

export default RequestBox;

  