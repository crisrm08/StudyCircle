import React from "react";
import ChatMessage from "./ChatMessage";
import { IoSend } from "react-icons/io5";
import "../css/chatpanel.css";

function ChatPanel({ image, name }) {
    return(
        <div className="chat-panel">
            <div className="top-panel">
                <img className="profile-pic" src={image} alt="imagen de perfil" />
                <h2>{name}</h2>
            </div>
            <ChatMessage />
            <ChatMessage />
            <ChatMessage />
            <ChatMessage />
            <div className="input-message-container">
                <h2>Escribe un mensaje...</h2>
                <IoSend />
            </div>
        </div>
    )
}

export default ChatPanel;