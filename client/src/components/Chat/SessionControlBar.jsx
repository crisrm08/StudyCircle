import React, { useState } from "react";
import "../../css/chatStyles/sessioncontrolbar.css";

function SessionControlBar() {
  const [hasRequestedEnd, setHasRequestedEnd] = useState(false);

  function handleClick(){
    setHasRequestedEnd(true);
  };

  return (
    <div className="session-bar">
        {hasRequestedEnd ? (
            <p className="session-message">
                Esperando al otro participante para cerrar la tutoría…
            </p>
        ) : (
            <button className="end-session-button" onClick={handleClick}>
                Finalizar tutoría
            </button>
        )}
    </div>
  ); 
}

export default SessionControlBar;
