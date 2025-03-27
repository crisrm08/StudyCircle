import React, { useContext, useState } from "react";
import { ScreenContext } from "../contexts/ScreenContext";
import "../css/modeselection.css";

function ModeSelection() {
  const [mode, setMode] = useState("cualquiera");
  const { setCurrentScreen } = useContext(ScreenContext);

  function changeMode(event) {
    setMode(event.target.name);
    setCurrentScreen("Results");
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