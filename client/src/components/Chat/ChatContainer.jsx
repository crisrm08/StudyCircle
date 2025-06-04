import React, {useState, useEffect} from "react";
import ChatPanel from "./ChatPanel";
import ChatSidebar from "./ChatSidebar";
import "../../css/chatStyles/chatcontainer.css";

function ChatContainer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarVisible, setSidebarVisible] = useState(true);  
  const [isPanelVisible, setPanelVisible] = useState(window.innerWidth > 768);

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (mobile) {
      
        setSidebarVisible(true);
        setPanelVisible(false);
      } else {
        setSidebarVisible(true);
        setPanelVisible(true);
      }
  }

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function openChat() {
    if (isMobile) {
      setSidebarVisible(false);
      setPanelVisible(true);
    }
  }

  function closeChat() {
    if (isMobile) {
      setPanelVisible(false);
      setSidebarVisible(true);
    }
  }

  return (
    <div className="chat-container">
      {isSidebarVisible && ( <ChatSidebar hideChatSidebar={openChat}/>)}
      {isPanelVisible && (
        <ChatPanel
          name="Carlos Santana"
          image="https://randomuser.me/api/portraits/men/12.jpg"
          hideChatPanel={closeChat}
        />
      )}
    </div>
  );
}


export default ChatContainer;