import React, { useContext } from "react";
import { ScreenContext } from "../contexts/ScreenContext";
import SearchScreen from "./SearchScreen";
import ResultScreen from "./ResultScreen";
import TutorScreen from "./TutorScreen";
import LoginScreen from "./LoginScreen";
import StudentSignUp1Screen from "./StudentSignUp1Screen";
import StudentSignUp2Screen from "./StudentSignUp2Screen";
import TutorSignUp1Screen from "./TutorSignUp1Screen";
import TutorSignUp2Screen from "./TutorSignUp2Screen";
import ChatScreen from "./ChatScreen";

function Screens() {
  const { currentScreen } = useContext(ScreenContext);

  return (
    <>
    {currentScreen === "Search" && <SearchScreen />}
    {currentScreen === "Results" && <ResultScreen />}
    {currentScreen === "Tutor" && <TutorScreen />}
    {currentScreen === "Login" && <LoginScreen />}
    {currentScreen === "Chat" && <ChatScreen />}
    {currentScreen === "StudentSignUp1" && <StudentSignUp1Screen />}
    {currentScreen === "StudentSignUp2" && <StudentSignUp2Screen />}
    {currentScreen === "TutorSignUp1" && <TutorSignUp1Screen />}
    {currentScreen === "TutorSignUp2" && <TutorSignUp2Screen />}
    </>
  );
}

export default Screens;
