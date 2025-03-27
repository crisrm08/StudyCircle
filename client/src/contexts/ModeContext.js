import React, { createContext, useState } from "react";

export const ModeContext = createContext();

export function ModeProvider({ children }) {
  const [mode, setMode] = useState("presencial");

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}