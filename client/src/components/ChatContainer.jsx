import React from "react";
import ChatPanel from "./ChatPanel";
import ChatSidebar from "./ChatSidebar";
import "../css/chatcontainer.css";

function ChatContainer() {
    return(
        <div className="chat-container">
            <ChatSidebar />
            <ChatPanel name={"Carlos Santana"} image={"https://randomuser.me/api/portraits/men/12.jpg"} />
        </div>
    )
}

export default ChatContainer;