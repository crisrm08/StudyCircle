import React from "react";
import { SubjectTopicProvider } from "./contexts/SubjectTopicContext";
import { TimeProvider } from "./contexts/TimeContext";
import { ModeProvider } from "./contexts/ModeContext";
import { MessageProvider } from "./contexts/MessageContext";
import { UserProvider } from "./contexts/UserContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { ActiveTabProvider } from "./contexts/ActiveTabContext";

function AppProviders({ children }) {
  return (
    <UserProvider>
      <SidebarProvider>
        <ActiveTabProvider>
          <SubjectTopicProvider>
            <TimeProvider>
              <ModeProvider>
                <MessageProvider>
                  {children} 
                </MessageProvider>
              </ModeProvider>
            </TimeProvider>
          </SubjectTopicProvider>
        </ActiveTabProvider>
      </SidebarProvider>
    </UserProvider>
  );
}

export default AppProviders;
