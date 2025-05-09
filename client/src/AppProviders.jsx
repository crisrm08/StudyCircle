import React from "react";
import { SubjectTopicProvider } from "./contexts/SubjectTopicContext";
import { TimeProvider } from "./contexts/TimeContext";
import { ModeProvider } from "./contexts/ModeContext";
import { MessageProvider } from "./contexts/MessageContext";
import { UserProvider } from "./contexts/UserContext";
import { SidebarProvider } from "./contexts/SidebarContext";

function AppProviders({ children }) {
  return (
    <UserProvider>
      <SidebarProvider>
        <SubjectTopicProvider>
          <TimeProvider>
            <ModeProvider>
              <MessageProvider>
                {children}
              </MessageProvider>
            </ModeProvider>
          </TimeProvider>
        </SubjectTopicProvider>
      </SidebarProvider>
    </UserProvider>
  );
}

export default AppProviders;
