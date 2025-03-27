import React, { createContext, useState } from "react";

export const ScreenContext = createContext();

export function ScreenProvider({ children }) {
  const [currentScreen, setCurrentScreen] = useState("Search");

  return (
    <ScreenContext.Provider value={{ currentScreen, setCurrentScreen }}>
      {children}
    </ScreenContext.Provider>
  );
}
