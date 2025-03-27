import React, { createContext, useState } from "react";

export const SubjectTopicContext = createContext();

export function SubjectTopicProvider({ children }) {
  const [subject, setSubject] = useState("🧮 Cálculo");
  const [topic, setTopic] = useState("");

  return (
    <SubjectTopicContext.Provider value={{ subject, setSubject, topic, setTopic }}>
      {children}
    </SubjectTopicContext.Provider>
  );
}
