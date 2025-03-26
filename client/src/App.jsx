import React from "react";
import ResultScreen from "./components/ResultScreen";
import SearchScreen from "./components/SearchScreen";
import { SubjectTopicProvider } from "./contexts/SubjectTopicContext";

function App() {
  return (
    <SubjectTopicProvider>
      <ResultScreen />
    </SubjectTopicProvider>
  );
}

export default App;
