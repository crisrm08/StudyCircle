import React, { useState } from "react";
import "../css/timeselection.css";

function TimeSelection() {
  const [time, setTime] = useState(0); 
  const [day, setDay] = useState("Lunes"); 

  const handleTimeChange = (event) => {
    let newTime = parseInt(event.target.value, 10);
    if (newTime < 0) newTime = 0;
    if (newTime > 23) newTime = 23;
    setTime(newTime);
  };

  const handleClick = (increment) => {
    let newTime = time + increment;
    if (newTime < 0) newTime = 23;
    if (newTime > 23) newTime = 0;
    setTime(newTime);
  };

  const handleDayChange = (event) => {
    setDay(event.target.value);
  };

  return (
    <div className="time-selection-wrapper">
      <h1>Selecciona un día y una hora</h1>
  
      <div className="time-selection-box">
        <div className="selector-card">
          <label htmlFor="day-select">Día de la semana:</label>
          <select id="day-select" value={day} onChange={handleDayChange}>
            <option value="Lunes">Lunes</option>
            <option value="Martes">Martes</option>
            <option value="Miércoles">Miércoles</option>
            <option value="Jueves">Jueves</option>
            <option value="Viernes">Viernes</option>
            <option value="Sábado">Sábado</option>
            <option value="Domingo">Domingo</option>
          </select>
          <p>Día seleccionado: <strong>{day}</strong></p>
        </div>
  
        <div className="selector-card">
          <label>Hora deseada:</label>
          <div className="hour-picker">
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
          <p>Hora seleccionada: <strong>{time}:00</strong></p>
        </div>
      </div>
    </div>
  );
  
}

export default TimeSelection;
