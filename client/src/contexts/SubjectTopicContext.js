import React, { createContext, useState } from "react";

export const SubjectTopicContext = createContext();

export function SubjectTopicProvider({ children }) {
  const [subject, setSubject] = useState("🧮 Cálculo");
  const [topic, setTopic] = useState("Cinematica y movimiento");

  return (
    <SubjectTopicContext.Provider value={{ subject, setSubject, topic, setTopic }}>
      {children}
    </SubjectTopicContext.Provider>
  );
}
