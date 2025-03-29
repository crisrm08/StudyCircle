import React from "react";
import Header from "./Header"
import ChatContainer from "./ChatContainer";
import "../css/chatscreen.css"

function ChatScreen() {
    return(
        <div className="chat-screen" >
            <Header />
            <div className="chat-screen-container">
                <ChatContainer/>
            </div>
        </div>
    )
}

export default ChatScreen;
