import React from "react";
import { useState } from "react";
import "../css/modeselection.css";

function ModeSelection() {
    const [mode, setMode] = useState("cualquiera");

    function changeMode(event) {
        setMode(event.target.name);
    }

    return (
        <div className="mode-selection-container">
            <h1>Alguna modalidad preferida?</h1>
            <div className="mode-buttons-container">
                <button className={mode === "presencial" ? "active" : ""} name="presencial" onClick={changeMode}> 🏫 Presencial </button>
                <button className={mode === "virtual" ? "active" : ""} name="virtual" onClick={changeMode}> 💻 Virtual </button>
                <button className={mode === "cualquiera" ? "active" : ""} name="cualquiera" onClick={changeMode}> 🔀 Cualquiera </button>
            </div>
        </div>
    );
}


export default ModeSelection;