import React, { useContext } from "react";
import { ScreenContext } from "../contexts/ScreenContext";
import SearchScreen from "./SearchScreen";
import ResultScreen from "./ResultScreen";
import TutorScreen from "./TutorScreen";

function Screens() {
  const { currentScreen } = useContext(ScreenContext);

  return (
    <>
    {currentScreen === "Search" && <SearchScreen />}
    {currentScreen === "Results" && <ResultScreen />}
    {currentScreen === "Tutor" && <TutorScreen />}
    </>
  );
}

export default Screens;
