import React from "react";
import { SubjectTopicProvider } from "./contexts/SubjectTopicContext";
import { TimeProvider } from "./contexts/TimeContext";
import { ModeProvider } from "./contexts/ModeContext";
import { MessageProvider } from "./contexts/MessageContext";
import { UserProvider } from "./contexts/UserContext";

function AppProviders({ children }) {
  return (
    <UserProvider>
        <SubjectTopicProvider>
          <TimeProvider>
            <ModeProvider>
              <MessageProvider>
                {children}
              </MessageProvider>
            </ModeProvider>
          </TimeProvider>
        </SubjectTopicProvider>
    </UserProvider>
  );
}

export default AppProviders;
