import React, {useState}from "react";
import ChatPreview from "./ChatPreview";
import "../../css/chatStyles/chatsidebar.css";

function ChatSidebar({hideChatSidebar}) {
  const [isPendingActive, setPendingActive] = useState(true);

  return (
    <div className="chat-sidebar">
      <div className="filter-container">
          <button
            className={`filter-button ${isPendingActive ? 'active' : ''}`}
            onClick={() => setPendingActive(true)}>
            Pendientes
          </button>

          <div className="divider" />

          <button
            className={`filter-button ${!isPendingActive ? 'active' : ''}`}
            onClick={() => setPendingActive(false)}>
            Finalizados
          </button>
      </div>

      <div className="chat-list">
        <div className="chat-list___scroll">
        <ChatPreview
          name="Carlos Santana"
          lastMessage="Gracias por la explicación, ahora sí entiendo"
          image="https://randomuser.me/api/portraits/men/12.jpg"
          handleOpenChat={hideChatSidebar}
        />
        <ChatPreview
          name="Yaneris Morillo"
          lastMessage="Ok"
          image="https://randomuser.me/api/portraits/women/12.jpg"
          handleOpenChat={hideChatSidebar}
        />
        <ChatPreview
          name="Mariel Casas"
          lastMessage="Muchas gracias"
          image="https://randomuser.me/api/portraits/women/22.jpg"
          handleOpenChat={hideChatSidebar}
        />
        <ChatPreview
          name="Pedro Henríquez"
          lastMessage="Le pondré 5 estrellas"
          image="https://randomuser.me/api/portraits/men/16.jpg"
          handleOpenChat={hideChatSidebar}
        />
  
        </div>
      </div>
    </div>
  );
}

export default ChatSidebar;
