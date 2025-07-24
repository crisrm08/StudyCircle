import React from "react";
import { SubjectTopicProvider } from "./contexts/SubjectTopicContext";
import { TimeProvider } from "./contexts/TimeContext";
import { ModeProvider } from "./contexts/ModeContext";
import { MessageProvider } from "./contexts/MessageContext";
import { UserProvider } from "./contexts/UserContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { ActiveTabProvider } from "./contexts/ActiveTabContext";
import { StudentSignUpProvider } from "./contexts/StudentSignUpContext";
import { TutorSignUpProvider } from "./contexts/TutorSignUpContext";
import { ChatsProvider } from "./contexts/ChatsContext";

function AppProviders({ children }) {
  return (
      <StudentSignUpProvider>
        <TutorSignUpProvider>
          <UserProvider>
            <ChatsProvider>
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
            </ChatsProvider>
          </UserProvider>
        </TutorSignUpProvider>
      </StudentSignUpProvider>
  );
}

export default AppProviders;
