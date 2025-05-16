import React, { useContext } from "react";
import Header from "./Header"
import ChatContainer from "./ChatContainer";
import Sidebar from "./Sidebar";
import { SidebarContext } from "../contexts/SidebarContext";
import "../css/chatscreen.css"

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
                    <div 
                        className="overlay" 
                        onClick={() => setIsSidebarClicked(false)}
                    />
                    <Sidebar />
                </>
            )}
        </div>
    )
}

export default ChatScreen;
