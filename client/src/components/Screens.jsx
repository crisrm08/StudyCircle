import React, { useContext } from "react";
import { ScreenContext } from "../contexts/ScreenContext";
import SearchScreen from "./SearchScreen";
import ResultScreen from "./ResultScreen";

function Screens() {
  const { currentScreen } = useContext(ScreenContext);

  return (
    <>
      {currentScreen === "Search" && <SearchScreen />}
      {currentScreen === "Results" && <ResultScreen />}
    </>
  );
}

export default Screens;
