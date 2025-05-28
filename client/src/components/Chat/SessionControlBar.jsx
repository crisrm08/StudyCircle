import React, { useState } from "react";
import "../../css/chatStyles/sessioncontrolbar.css";
import RatingModal from "./RatingModal";

function SessionControlBar() {
  const [hasRequestedEnd, setHasRequestedEnd] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);


  function handleClick(){
    setHasRequestedEnd(true);
    handleRatingSubmit();
    setShowRatingModal(true);
  };

  function handleRatingSubmit() {
    console.log("Rating submitted");
    setShowRatingModal(false);  
  }

  return (
    <div className="session-bar">
        {hasRequestedEnd ? (
            <p className="session-message">
                Esperando al otro participante para cerrar la tutoría…
            </p>
        ) : (
            <button className="end-session-button" onClick={handleClick} >
                Finalizar tutoría
            </button>
        )}
        <RatingModal
            isOpen={showRatingModal}
            onClose={() => setShowRatingModal(false)}
            onSubmit={handleRatingSubmit} 
        />
    </div>
  ); 
}

export default SessionControlBar;
