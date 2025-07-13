import React, { useContext, useState } from "react";
import Header from "../Common/Header"
import ChatContainer from "./ChatContainer";
import StudentSidebar from "../Common/StudentSidebar";
import TutorSidebar from "../Common/TutorSidebar";
import { useUser } from "../../contexts/UserContext";
import { SidebarContext } from "../../contexts/SidebarContext";
import "../../css/chatStyles/chatscreen.css"

function ChatScreen() {
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const { user } = useUser();

    return(
        <div className="chat-screen" >
            <Header />
            <div className="chat-screen-container">
                <ChatContainer/>
            </div>
            {isSidebarClicked && (
              <>
                <div className="overlay" onClick={() => setIsSidebarClicked(false)}/>
                {user.profile_type === "tutor" 
                  ? <TutorSidebar />
                  : <StudentSidebar />}
              </>
            )}
        </div>
    )
}

export default ChatScreen;
