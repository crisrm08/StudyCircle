import React, { useContext, useState } from "react";
import Header from "../Common/Header"
import ChatContainer from "./ChatContainer";
import StudentSidebar from "../Common/StudentSidebar";
import TutorSidebar from "../Common/TutorSidebar";
import { SidebarContext } from "../../contexts/SidebarContext";
import "../../css/chatStyles/chatscreen.css"

function ChatScreen() {
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const [ isTutorLogged ] = useState(false);

    return(
        <div className="chat-screen" >
            <Header />
            <div className="chat-screen-container">
                <ChatContainer/>
            </div>
            {isSidebarClicked && (
              <>
                <div
                  className="overlay"
                  onClick={() => setIsSidebarClicked(false)}
                />
                {isTutorLogged
                  ? <TutorSidebar />
                  : <StudentSidebar />}
              </>
            )}
        </div>
    )
}

export default ChatScreen;
