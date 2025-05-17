import React from "react";
import { FaStar } from "react-icons/fa";
import "../css/historylog.css";

function HistoryLog({ tutorName, date, topic, subtopic, rating, modality, avatar }) {
  return (
    <div className="log">
        <div className="log-header">
            <span className="log-date">{date}</span>
            <span className="log-mode">{modality}</span>
        </div>

        <div className="log-content">
                <img className="log-avatar" src={avatar} alt="avatar" />
                <div className="log-info">
                    <div className="log-tutor-rating">
                        <strong>{tutorName}</strong>
                        <div className="stars">
                            {[...Array(rating)].map((_, i) => (
                                <FaStar key={i} color="#f5ba13" size={14} />
                            ))}
                            {[...Array(5 - rating)].map((_, i) => (
                                <FaStar key={i} color="#ccc" size={14} />
                            ))}
                        </div>
                    </div>
                    <div className="log-topic">{topic} - {subtopic}</div>
                </div>
                <button className="request-button">Solicitar tutoría</button>
        </div>
    </div>
  );
}

export default HistoryLog;
