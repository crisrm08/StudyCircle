import React, { useState } from "react";
import "../../css/editProfileStyles/scheduleselector.css";

const daysOfWeek = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
];

function ScheduleSelector({ schedule, setSchedule }) {

  function toggleDay(day) {
    const current = schedule[day];
    setSchedule({
      ...schedule,
      [day]: current ? null : { from: "", to: "" }
    });
  };

  function updateTime(day, type, value) {
    setSchedule({
      ...schedule,
      [day]: {
        ...schedule[day],
        [type]: value
      }
    });
  };

  return (
    <div className="schedule-selector">
      {daysOfWeek.map((day) => (
        <div key={day} className="schedule-row">
          <label>
            <input 
              type="checkbox" 
              checked={!!schedule[day]} 
              onChange={() => toggleDay(day)} 
            />
            {day}
          </label>

          {schedule[day] && (
            <div className="time-inputs">
              <input 
                type="time" 
                value={schedule[day].from} 
                onChange={(e) => updateTime(day, "from", e.target.value)} 
              />
              <span>a</span>
              <input 
                type="time" 
                value={schedule[day].to} 
                onChange={(e) => updateTime(day, "to", e.target.value)} 
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ScheduleSelector;
