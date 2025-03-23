import React, { useState } from "react";
import "../css/timeselection.css";

function TimeSelection() {
  const [time, setTime] = useState(0); // Inicializa la hora en 0 (medianoche)

  // Función para actualizar la hora al escribir
  function handleTimeChange(event) {
    let newTime = parseInt(event.target.value, 10);
    if (newTime < 0) newTime = 0;
    if (newTime > 23) newTime = 23;
    setTime(newTime);
  };

  // Función para cambiar la hora al hacer clic
  function handleClick(increment) {
    let newTime = time + increment;
    if (newTime < 0) newTime = 23;
    if (newTime > 23) newTime = 0;
    setTime(newTime);
  };

  return (
    <div>
      <h1 style={{paddingBottom: "30px"}}>Selecciona una hora en la que te gustaría tomar una tutoría</h1>
      <div className="time-selection-container">
        
        <div className="time-input">
          <button onClick={() => handleClick(-1)}>-</button>
          
          <input 
            type="number" 
            value={time}
            onChange={handleTimeChange}
            min="0"
            max="23"
          />
          
          <button onClick={() => handleClick(1)}>+</button>
        </div>

        <p>Hora seleccionada: {time}:00</p>
      </div>
    </div>
  );
}

export default TimeSelection;
