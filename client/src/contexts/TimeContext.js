import React, { createContext, useState } from "react";

export const TimeContext = createContext();

export function TimeProvider({ children }) {
  const [hour, setHour] = useState("");
  const [day, setDay] = useState("");

  return (
    <TimeContext.Provider value={{ hour, setHour, day, setDay }}>
      {children}
    </TimeContext.Provider>
  );
}
