import React from "react";
import Header from "./Header"
import ChatContainer from "./ChatContainer";

function ChatScreen() {
    return(
        <div className="chat-screen" >
            <Header />
            <ChatContainer/>
        </div>
    )
}

export default ChatScreen;
