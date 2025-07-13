import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatMessage from "./ChatMessage";
import SessionControlBar from "./SessionControlBar";
import { IoSend } from "react-icons/io5";
import { useUser } from "../../contexts/UserContext";
import { MdKeyboardArrowLeft, MdHourglassEmpty } from "react-icons/md";
import "../../css/chatStyles/chatpanel.css";
import axios from "axios";

function ChatPanel({ chat, onClose, loggedUserRole }) {
  const [messages, setMessages] = useState([]);
  const { user } = useUser();
  const [text, setText] = useState("");
  const isTutor = loggedUserRole === "tutor";
  const navigate = useNavigate();

  useEffect(() => {
    // Carga mensajes cuando cambia el chat
    if (!chat || !chat.id) return;
    axios
      .get(`http://localhost:5000/chats/${chat.id}/messages`)
      .then(({ data }) => setMessages(data.messages))
      .catch(console.error);
  }, [chat]);

  function sendMessage() {
    if (!text.trim()) return;
    axios.post(`/chats/${chat.id}/messages`, {
        sender_id: user.user_id,
        content: text
      })
      .then(({ data }) => {
        if (data.message) {
          setMessages(prev => [...prev, data.message]);
        }
        setText("");
      })
      .catch(console.error);
  }


  function cancelTutorshipRequest() {
    // TODO: implementar cancelación de la solicitud
  }

  function endSession() {
    axios.patch(`http://localhost:5000/tutorship/requests/${chat.id}/close`,{ by: isTutor ? "tutor" : "student" })
    .catch(console.error);
  }

  function handleRating({ rating, comment }) {
    axios.post(`http://localhost:5000/tutorship/requests/${chat.id}/rate`, {
        rater_id: user.user_id,
        ratee_id:
          isTutor ? chat.otherUser.userId : chat.otherUser.userId,
        rating,
        comment,
      })
      .catch(console.error);
  }

  if (!chat) return null;

  return (
    <div className="chat-panel">
      {/* Top panel con avatar y detalles */}
      <div className="top-panel">
        <div className="left-side">
          <MdKeyboardArrowLeft
            size={40}
            color="#163172"
            className="chat-go-back"
            onClick={onClose}
          />
          <img
            className="profile-pic"
            src={chat.otherUser.avatar}
            alt={`Foto de ${chat.otherUser.name}`}
            onClick={() =>
              isTutor
                ? navigate(`/student-facts/${chat.otherUser.userId}`)
                : navigate(`/tutor-facts/${chat.otherUser.userId}`)
            }
          />
          <div>
            <h2>{chat.otherUser.name}</h2>
            <p className="subject-info">
              {chat.subject} • {chat.topic} • {chat.mode}
            </p>
          </div>
        </div>
      </div>

      {/* Notificación de solicitud pendiente */}
      {chat.status === "pending" && (
        <div className="tutorship-notification">
          <MdHourglassEmpty size={48} color="#163172" style={{ marginBottom: 12 }} />
          <h2>¡Solicitud enviada!</h2>
          <p>
            Tu solicitud de tutoría ha sido enviada al tutor. Te avisaremos cuando
            la acepte. ¡Gracias por confiar en StudyCircle!
          </p>
          <button className="cancel-tutorship-button subtle" onClick={cancelTutorshipRequest}>
            Cancelar solicitud
          </button>
        </div>
      )}

      {/* Notificación de solicitud rechazada */}
      {chat.status === "rejected" && (
        <div className="tutorship-rejected-notification">
          <p>Tu solicitud ha sido rechazada. Por favor, busca otro tutor.</p>
        </div>
      )}

      {/* Chat activo tras aceptación */}
      {chat.status === "accepted" && (
        <>
          <div className="messages-container">
            {messages
              .filter(m => m && m.content != null)
              .map(m => (
                <ChatMessage
                  key={m.message_id}
                  text={m.content}
                  isOwn={m.sender_id === user.user_id}
                />
              ))}
          </div>

           <SessionControlBar
            chat={chat}
            onEnd={endSession}
            onRate={handleRating}
            loggedUserRole={loggedUserRole}
          />

          <div className="input-message-container">
            <input
              type="text"
              placeholder="Escribe un mensaje…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={chat.status !== "accepted"}
            />
            <button className="send-button" onClick={sendMessage}>
              <IoSend col/>
            </button>
          </div>
         
        </>
      )}
    </div>
  );
}

export default ChatPanel;
