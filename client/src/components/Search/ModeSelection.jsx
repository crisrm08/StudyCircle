import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { ModeContext } from "../../contexts/ModeContext";
import { SubjectTopicContext } from "../../contexts/SubjectTopicContext";
import "../../css/searchStyles/modeselection.css";

function ModeSelection() {
  const navigate = useNavigate();
  const {mode, setMode} = useContext(ModeContext);
  const { topic } = useContext(SubjectTopicContext);

  function changeMode(event) {
    setMode(event.target.name);
    if (topic) {
      navigate("/results");
    } 
  }
    return (
        <div className="mode-selection-container">
            <h1>¿Alguna modalidad preferida?</h1>
            <div className="mode-buttons-container">
                <button className={mode === "presencial" ? "active" : ""} name="🏫 Presencial" onClick={changeMode}> 🏫 Presencial </button>
                <button className={mode === "virtual" ? "active" : ""} name="💻 Virtual" onClick={changeMode}> 💻 Virtual </button>
                <button className={mode === "cualquiera" ? "active" : ""} name="🔀 Cualquiera" onClick={changeMode}> 🔀 Cualquiera </button>
            </div>
        </div>
    );
}


export default ModeSelection;