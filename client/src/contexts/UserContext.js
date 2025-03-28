import React, { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState("estudiante");
  const [password, setPassword] = useState("");

  return (
    <UserContext.Provider value={{ user, setUser, password, setPassword }}>
      {children}
    </UserContext.Provider>
  );
}
