import React from "react";
import { ScreenProvider } from "./contexts/ScreenContext";
import { SubjectTopicProvider } from "./contexts/SubjectTopicContext";
import { TimeProvider } from "./contexts/TimeContext";
import { ModeProvider } from "./contexts/ModeContext";
import { MessageProvider } from "./contexts/MessageContext";
import { UserProvider } from "./contexts/UserContext";

function AppProviders({ children }) {
  return (
    <UserProvider>
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
    </UserProvider>
  );
}

export default AppProviders;
