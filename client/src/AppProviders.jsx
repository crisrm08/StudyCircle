import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { SubjectTopicProvider } from "./contexts/SubjectTopicContext";
import { TimeProvider } from "./contexts/TimeContext";
import { ModeProvider } from "./contexts/ModeContext";
import { MessageProvider } from "./contexts/MessageContext";
import { UserProvider } from "./contexts/UserContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { ActiveTabProvider } from "./contexts/ActiveTabContext";
import { StudentSignUpProvider } from "./contexts/StudentSignUpContext";

function AppProviders({ children }) {
  return (
    <AuthProvider>
      <StudentSignUpProvider>
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
      </StudentSignUpProvider>
    </AuthProvider>
  );
}

export default AppProviders;
