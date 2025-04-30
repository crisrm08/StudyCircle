import React, { useContext } from "react";
import { ScreenContext } from "../contexts/ScreenContext";
import SearchScreen from "./SearchScreen";
import ResultScreen from "./ResultScreen";
import TutorScreen from "./TutorScreen";
import LoginScreen from "./LoginScreen";
import StudentSignUp1Screen from "./StudentSignUp1Screen";
import StudentSignUp2Screen from "./StudentSignUp2Screen";
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
    </>
  );
}

export default Screens;
