import React, { useContext} from "react";
import { TimeContext } from "../../contexts/TimeContext";
import "../../css/searchStyles/timeselection.css";

function TimeSelection() {
  const {hour, setHour, day, setDay} = useContext(TimeContext); 

  function handleClick (increment){
    let newHour = hour + parseInt(increment);
    if (newHour < 8) newHour = 8;
    if (newHour > 22) newHour = 22;
    setHour(newHour);
  };

  function handleDayChange (event){
    setDay(event.target.value);
  };

  return (
    <div className="time-selection-wrapper">
      <h1>Selecciona un día y una hora para la tutoría (opcional)</h1>
  
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
            <option value="Cualquiera">Cualquiera</option>
          </select>
          <p>Día seleccionado: <strong>{day}</strong></p>
        </div>
  
        <div className="selector-card">
          <label>Hora deseada:</label>
         <div className="hour-picker">
          <button onClick={() => handleClick(-1)}>-</button>

          <select
            value={hour != null ? hour : ""}
            onChange={e => setHour(parseInt(e.target.value, 10))}
            disabled={day === ""}
          >
            <option value="" disabled hidden>--:--</option>
            {Array.from({ length: 15 }, (_, i) => i + 8).map(h => (
              <option key={h} value={h}>
                {String(h).padStart(2, "0")}:00
              </option>
            ))}
          </select>

          <button onClick={() => handleClick(1)}>+</button>
        </div>

          <p>Hora seleccionada: <strong>{hour !== null ? hour : "Cualquiera"}</strong></p>
        </div>
      </div>
    </div>
  );
  
}

export default TimeSelection;
