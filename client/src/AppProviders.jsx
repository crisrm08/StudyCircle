import React from "react";
import { ScreenProvider } from "./contexts/ScreenContext";
import { SubjectTopicProvider } from "./contexts/SubjectTopicContext";
import { TimeProvider } from "./contexts/TimeContext";
import { ModeProvider } from "./contexts/ModeContext";
import { MessageProvider } from "./contexts/MessageContext";

function AppProviders({ children }) {
  return (
    <ScreenProvider>
      <SubjectTopicProvider>
        <TimeProvider>
          <ModeProvider>
            <MessageProvider>
              {children}
            </MessageProvider>
          </ModeProvider>
        </TimeProvider>
      </SubjectTopicProvider>
    </ScreenProvider>
  );
}

export default AppProviders;
