import React, { createContext, useState } from "react";

export const TimeContext = createContext();

export function TimeProvider({ children }) {
  const [hour, setHour] = useState("cualquiera");
  const [day, setDay] = useState("cualquiera");

  return (
    <TimeContext.Provider value={{ hour, setHour, day, setDay }}>
      {children}
    </TimeContext.Provider>
  );
}
