import React, { useState } from "react";
import ChatPreview from "./ChatPreview";
import "../../css/chatStyles/chatsidebar.css";

function ChatSidebar({ chats = [], selectedChat, onSelectChat, loggedUserRole }) {
  const [isPendingActive, setPendingActive] = useState(true);

  const pendingChats = chats.filter(c =>
    isPendingActive
      ? (loggedUserRole==='tutor'
         ? c.status==='accepted'
         : ['pending','accepted','rejected'].includes(c.status))
      : c.status==='finished'
  );

  const hasNewInPending = pendingChats.some(c => c.hasNewMessage);
  const finalChats = chats.filter(c => c.status==='finished');
  const hasUnratedInFinal = finalChats.some(c => !c.hasRated);

  return (
    <div className="chat-sidebar">
      <div className="filter-container">
        <button
          className={`filter-button ${isPendingActive ? 'active' : ''}`}
          onClick={() => setPendingActive(true)} style={{ position: "relative" }}
        >
          Pendientes
          {hasNewInPending && <span className="notification-dot small" />}
        </button>

        <div className="divider" />

        <button
          className={`filter-button ${!isPendingActive ? 'active' : ''}`}
          onClick={() => setPendingActive(false)} style={{ position: "relative" }}
        >
          Finalizados
          {hasUnratedInFinal && <span className="notification-dot small" />} 
        </button>
      </div>

      <div className="chat-list">
        {pendingChats.length === 0 ? (
          loggedUserRole === "student" ? ( <div className="no-chats-message">No hay chats disponibles, solicita tutorías para abrir un chat con tutores</div>
          ) : (
            <div className="no-chats-message">No hay chats disponibles, espera a que los estudiantes soliciten tutorías</div>
          )

        ) : (
          pendingChats.map(chat => (
            <ChatPreview
              key={chat.id}
              tutorship_id={chat.id}
              name={chat.otherUser.name}
              otherUserId={chat.otherUser.userId}
              lastMessage={chat.lastMessage}
              image={chat.otherUser.avatar}
              status={chat.status}
              needsRating={!chat.hasRated}
              hasNewMessage={chat.hasNewMessage}
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
