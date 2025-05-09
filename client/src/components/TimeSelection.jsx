import React, { useContext} from "react";
import { TimeContext } from "../contexts/TimeContext";
import "../css/timeselection.css";

function TimeSelection() {
  const {hour, setHour, day, setDay} = useContext(TimeContext); 
 

  const handleHourChange = (event) => {
    let newHour = parseInt(event.target.value, 10);
    if (newHour < 0) newHour = 0;
    if (newHour > 23) newHour = 23;
    setHour(newHour);
  };

  const handleClick = (increment) => {
    let newHour = hour + increment;
    if (newHour < 0) newHour = 23;
    if (newHour > 23) newHour = 0;
    setHour(newHour);
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
          <option value="" disabled hidden> Cualquiera </option>
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
            {typeof hour === 'number' ? (
              <input type="number" value={hour} onChange={handleHourChange} min="0" max="23" placeholder="Cualquiera"/>
            ) : (
              <input type="text" value={hour} onChange={handleHourChange} placeholder="Cualquiera"/>
            )}
            <button onClick={() => handleClick(1)}>+</button>
          </div>
          <p>Hora seleccionada: <strong>{hour}</strong></p>
        </div>

      </div>
    </div>
  );
  
}

export default TimeSelection;
