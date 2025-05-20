import React, { createContext, useState } from "react";

export const TimeContext = createContext();

export function TimeProvider({ children }) {
  const [hour, setHour] = useState("19:30");
  const [day, setDay] = useState("Miércoles");

  return (
    <TimeContext.Provider value={{ hour, setHour, day, setDay }}>
      {children}
    </TimeContext.Provider>
  );
}
