import React from "react";
import ChatPreview from "./ChatPreview";
import "../../css/chatStyles/chatsidebar.css";

function ChatSidebar() {
  return (
    <div className="chat-sidebar">
      <div className="filter-container">
        <button className="filter-button active">Pendientes</button>
        <div className="divider"></div>
        <button className="filter-button">Finalizados</button>
      </div>

      <div className="chat-list">
        <ChatPreview
          name="Carlos Santana"
          lastMessage="Gracias por la explicación, ahora sí entiendo"
          image="https://randomuser.me/api/portraits/men/12.jpg"
        />
        <ChatPreview
          name="Yaneris Morillo"
          lastMessage="Ok"
          image="https://randomuser.me/api/portraits/women/12.jpg"
        />
        <ChatPreview
          name="Mariel Casas"
          lastMessage="Muchas gracias"
          image="https://randomuser.me/api/portraits/women/22.jpg"
        />
        <ChatPreview
          name="Pedro Henríquez"
          lastMessage="Le pondré 5 estrellas"
          image="https://randomuser.me/api/portraits/men/16.jpg"
        />
      </div>
    </div>
  );
}

export default ChatSidebar;
