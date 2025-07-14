import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/chatStyles/sessioncontrolbar.css";
import RatingModal from "./RatingModal";

function SessionControlBar({ chat, onEnd, onRate, loggedUserRole }) {
  const [hasRequestedEnd, setHasRequestedEnd] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [bothParticipantsReady, setBothParticipantsReady] = useState(false);

  useEffect(() => {
    setHasRequestedEnd(false);
    setBothParticipantsReady(false);
    setShowRatingModal(false);

   
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/tutorship/requests/${chat.id}`)
      .then(({ data }) => {
        const userClosed =
          loggedUserRole === "tutor" ? data.tutor_closed : data.student_closed;
        setHasRequestedEnd(userClosed);
        if (data.student_closed && data.tutor_closed) {
          setBothParticipantsReady(true);
          setShowRatingModal(true);
        }
      })
      .catch((err) => console.error("Error fetching session status:", err));
  }, [chat.id, loggedUserRole]);

  useEffect(() => {
    if (!hasRequestedEnd) return;
    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/tutorship/requests/${chat.id}`);
        if (data.student_closed && data.tutor_closed) {
          setBothParticipantsReady(true);
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error polling session close status:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [hasRequestedEnd, chat.id]);

  useEffect(() => {
    if (bothParticipantsReady) {
      setShowRatingModal(true);
    }
  }, [bothParticipantsReady]);

  if (!chat || !loggedUserRole) return null;

  function handleEnd() {
    onEnd();
    setHasRequestedEnd(true);
  }

  function handleSubmitRating(values) {
    onRate(values);
    setShowRatingModal(false);
  }

  function handleUserReport() {
    console.log("Report user not implemented yet");
  }

  return (
    <div className="session-bar">
      {!hasRequestedEnd ? (
        <div className="session-control-buttons">
          <button className="end-session-button" onClick={handleEnd}>
            Finalizar tutoría
          </button>
          <button className="report-user-button" onClick={handleUserReport}>
            {loggedUserRole === "tutor"
              ? "Reportar estudiante"
              : "Reportar tutor"}
          </button>
        </div>
      ) : (
        <div className="session-end-message">
          <p className="session-message">
            Esperando al otro participante para cerrar la tutoría…
          </p>
          <button className="report-user-button" onClick={handleUserReport}>
            {loggedUserRole === "tutor"
              ? "Reportar estudiante"
              : "Reportar tutor"}
          </button>
        </div>
      )}

      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleSubmitRating}
        loggedUserRole={loggedUserRole}
      />
    </div>
  );
}

export default SessionControlBar;
