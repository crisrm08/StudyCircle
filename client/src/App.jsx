import React from "react";
import { ScreenProvider } from "./contexts/ScreenContext";
import { SubjectTopicProvider } from "./contexts/SubjectTopicContext";
import Screens from "./components/Screens"; 

function App() {
  return (
    <ScreenProvider>
      <SubjectTopicProvider>
        <Screens />
      </SubjectTopicProvider>
    </ScreenProvider>
  );
}

export default App;