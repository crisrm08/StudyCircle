import React from "react";
import "../css/modeselection.css";

function ModeSelection() {
    return(
        <div className="mode-selection-container">
            <h1>Alguna modalidad preferida?</h1>
            <div className="mode-buttons-container">
                <button>Presencial</button>
                <button>Virtual</button>
                <button>Cualquiera</button>
            </div>
        </div>
    )
}

export default ModeSelection;