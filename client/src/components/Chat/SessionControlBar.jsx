import React, { useState } from "react";
import "../../css/chatStyles/sessioncontrolbar.css";
import RatingModal from "./RatingModal";

function SessionControlBar(loggedUserRole) {
  const [hasRequestedEnd, setHasRequestedEnd] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [bothParticipantsReady, setBothParticipantsReady] = useState(false);

  function handleEndTutorship(){
    setHasRequestedEnd(true);
    handleRatingSubmit();
  };

  function handleUserReport(){
    console.log("not implemented yet");
  }

  if (bothParticipantsReady) {
    setShowRatingModal(true);
    setBothParticipantsReady(false);
  }

  function handleRatingSubmit() {
    console.log("Rating submitted");
    setShowRatingModal(false);  
  }

  if (!loggedUserRole) return null;

  return (
    <div className="session-bar">
        {hasRequestedEnd ? (
          <div className="session-end-message">
            <p className="session-message">
                Esperando al otro participante para cerrar la tutoría…
            </p>

            <button className="report-user-button" onClick={handleUserReport}>
              {loggedUserRole === "tutor" ? "Reportar estudiante" : "Reportar tutor"}
            </button>
          </div>
        ) : (
          <div className="session-control-buttons">
            <button className="end-session-button" onClick={handleEndTutorship} >
                Finalizar tutoría
            </button>

            <button className="report-user-button" onClick={handleUserReport}>
              {loggedUserRole === "tutor" ? "Reportar estudiante" : "Reportar tutor"}
            </button>
          </div>
        )}
        <RatingModal
            isOpen={showRatingModal}
            onClose={() => setShowRatingModal(false)}
            onSubmit={handleRatingSubmit} 
            loggedUserRole={loggedUserRole}
        />
    </div>
  ); 
}

export default SessionControlBar;
