import React, { useContext } from "react";
import { ScreenContext } from "../contexts/ScreenContext";
import SearchScreen from "./SearchScreen";
import ResultScreen from "./ResultScreen";
import TutorScreen from "./TutorScreen";
import LoginScreen from "./LoginScreen";
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
    </>
  );
}

export default Screens;
