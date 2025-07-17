import React, { useState } from "react";
import ChatPreview from "./ChatPreview";
import "../../css/chatStyles/chatsidebar.css";

function ChatSidebar({ chats = [], selectedChat, onSelectChat, loggedUserRole }) {
  const [isPendingActive, setPendingActive] = useState(true);

  const displayedChats = chats.filter(chat => {
    // pestaña "Pendientes"
    if (isPendingActive) {
      // estudiante ve pending, tutor ve accepted
      return loggedUserRole === 'tutor'
        ? chat.status === 'accepted'
        : chat.status === 'pending' || chat.status === 'accepted';
    }
    // pestaña "Finalizados"
    return chat.status === 'finished';
  });

  return (
    <div className="chat-sidebar">
      <div className="filter-container">
        <button
          className={`filter-button ${isPendingActive ? 'active' : ''}`}
          onClick={() => setPendingActive(true)}
        >
          Pendientes
        </button>

        <div className="divider" />

        <button
          className={`filter-button ${!isPendingActive ? 'active' : ''}`}
          onClick={() => setPendingActive(false)}
        >
          Finalizados
        </button>
      </div>

      <div className="chat-list">
        {displayedChats.length === 0 ? (
          loggedUserRole === "student" ? ( <div className="no-chats-message">No hay chats disponibles, solicita tutorías para abrir un chat con tutores</div>
          ) : (
            <div className="no-chats-message">No hay chats disponibles, espera a que los estudiantes soliciten tutorías</div>
          )

        ) : (
          displayedChats.map(chat => (
            <ChatPreview
              key={chat.id}
              id={chat.id}
              name={chat.otherUser.name}
              otherUserId={chat.otherUser.userId}
              lastMessage={chat.lastMessage}
              image={chat.otherUser.avatar}
              status={chat.status}
              handleOpenChat={() => onSelectChat(chat)}
              loggedUserRole={loggedUserRole}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ChatSidebar;
