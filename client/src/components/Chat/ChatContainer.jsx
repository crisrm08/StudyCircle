import React, {useState, useEffect} from "react";
import ChatPanel from "./ChatPanel";
import { useUser } from "../../contexts/UserContext";
import ChatSidebar from "./ChatSidebar";
import axios from "axios";
import "../../css/chatStyles/chatcontainer.css";

function ChatContainer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarVisible, setSidebarVisible] = useState(true);  
  const [isPanelVisible, setPanelVisible] = useState(window.innerWidth > 768);
  const {user} = useUser();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);


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

  const userId = user?.user_id;

  useEffect(() => {
    if (!userId) return;

    axios.get("http://localhost:5000/chats", { params: { user_id: userId } })
      .then(({ data }) => {
         const chatsArr = Array.isArray(data.chats) ? data.chats : [];
        setChats(chatsArr);

      if (!selectedChat && chatsArr.length > 0) {
        let chatToSelect;
        if (user.profile_type === 'student') {
          chatToSelect = chatsArr.find(c => c.status === 'pending') || chatsArr.find(c => c.status === 'accepted');
        } else {
          chatToSelect = chatsArr.find(c => c.status === 'accepted');
        }
        if (chatToSelect) {
          setSelectedChat(chatToSelect);
          openChat(); 
        }
      }
      })
      .catch(err => {
        console.error("Error fetching chats:", err);
        setChats([]);
      });
  }, [userId]);

  if (!user) return null;

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
      {isSidebarVisible && (
        <ChatSidebar
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={chat => {
            setSelectedChat(chat);
            openChat();
          }}
          loggedUserRole={user.profile_type}
        />
      )}
      {isPanelVisible && selectedChat && (
        <ChatPanel
          chat={selectedChat}
          onClose={closeChat}
          loggedUserRole={user.profile_type}
        />
      )}
    </div>
  );
}

export default ChatContainer;