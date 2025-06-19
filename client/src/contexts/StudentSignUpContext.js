import React, { createContext, useState } from "react";

export const StudentSignUpContext = createContext();

export function StudentSignUpProvider({ children }) {
  const [studentSignUpData, setStudentSignUpData] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    career: "",
    profile_type: "student",
    subject_weak: [],
    subject_strong: [],
    institution: "",
    year: "",
    id_photo: null,
    selfie_photo: null,
  });

  return (
    <StudentSignUpContext.Provider value={{ studentSignUpData, setStudentSignUpData }}>
      {children}
    </StudentSignUpContext.Provider>
  );
}
