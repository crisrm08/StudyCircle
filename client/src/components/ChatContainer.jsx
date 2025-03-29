import React from React;
import ChatPanel from "./ChatPanel";
import ChatSidebar from "./ChatSidebar";

function ChatContainer() {
    return(
        <div>
            <ChatSidebar />
            <ChatPanel />
        </div>
    )
}

export default ChatContainer;