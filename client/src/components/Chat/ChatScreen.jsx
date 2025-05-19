import React, { useContext } from "react";
import Header from "../Common/Header"
import ChatContainer from "./ChatContainer";
import StudentSidebar from "../Common/StudentSidebar";
import { SidebarContext } from "../../contexts/SidebarContext";
import "../../css/chatStyles/chatscreen.css"

function ChatScreen() {
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);

    return(
        <div className="chat-screen" >
            <Header />
            <div className="chat-screen-container">
                <ChatContainer/>
            </div>
            {isSidebarClicked && (
                <>
                    <div className="overlay" onClick={() => setIsSidebarClicked(false)}/>
                    <StudentSidebar />
                </>
            )}
        </div>
    )
}

export default ChatScreen;
