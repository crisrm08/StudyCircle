import React, { createContext, useState } from "react";

export const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isSidebarClicked, setIsSidebarClicked] = useState(false);

  return (
    <SidebarContext.Provider value={{ isSidebarClicked, setIsSidebarClicked }}>
      {children}
    </SidebarContext.Provider>
  );
}
