import React, { createContext, useState } from "react";

export const TutorSignUpContext = createContext();

export function TutorSignUpProvider({ children }) {
  const [tutorSignUpData, setTutorSignUpData] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    profile_type: "tutor",
    academic_level: "",
    subject_teach: [],
    institution: "",
    occupation: "",
    hourly_fee: "",
    id_photo: null,
    selfie_photo: null,
  });

  return (
    <TutorSignUpContext.Provider value={{ tutorSignUpData, setTutorSignUpData }}>
      {children}
    </TutorSignUpContext.Provider>
  );
}
