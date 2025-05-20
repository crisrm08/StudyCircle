import React, { createContext, useState } from "react";

export const ActiveTabContext = createContext();

export function ActiveTabProvider({ children }) {
  const [activeTab, setActiveTab] = useState("Solicitudes");

  return (
    <ActiveTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ActiveTabContext.Provider>
  );
}