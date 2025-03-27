import React from "react";
import AppProviders from "./AppProviders";
import Screens from "./components/Screens";

function App() {
  return (
    <AppProviders>
      <Screens />
    </AppProviders>
  );
}

export default App;
