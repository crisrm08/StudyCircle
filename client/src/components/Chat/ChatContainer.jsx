import React, {useState, useEffect} from "react";
import ChatPanel from "./ChatPanel";
import { useUser } from "../../contexts/UserContext";
import ChatSidebar from "./ChatSidebar";
import axios from "axios";
import "../../css/chatStyles/chatcontainer.css";
import { useLocation } from "react-router-dom";

function ChatContainer() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarVisible, setSidebarVisible] = useState(true);  
  const [isPanelVisible, setPanelVisible] = useState(window.innerWidth > 768);
  const {user} = useUser();
  const location = useLocation();
  const forcedId = location.state?.selectedChatId; 
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
    if (!user) return;
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/chats`, { params: { user_id: user.user_id } })
      .then(({ data }) => {
        const arr = Array.isArray(data.chats) ? data.chats : [];
        setChats(arr);

        if (forcedId) {
          const forced = arr.find(c => c.id === forcedId);
          if (forced) {
            setSelectedChat(forced);
            if (isMobile) openChat();
            return;
          }
        }

        if (!selectedChat && arr.length > 0) {
          let chatToSelect;
          if (user.profile_type === 'student') {
            chatToSelect = arr.find(c => c.status === 'pending') 
                         || arr.find(c => c.status === 'accepted');
          } else {
            chatToSelect = arr.find(c => c.status === 'accepted');
          }
          if (chatToSelect) {
            setSelectedChat(chatToSelect);
            if (isMobile) openChat();
          }
        }
      })
      .catch(console.error);
  }, [user, forcedId]); 

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
          loggedUserId={user.user_id}
        />
      )}
    </div>
  );
}

export default ChatContainer;