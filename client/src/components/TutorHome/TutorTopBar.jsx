import React from "react";
import { FaStar } from "react-icons/fa";
import "../../css/tutorHomeStyles/tutortopbar.css";

function TutorTopBar({ name, avatar, rating, subjects, price, schedule }) {
    return (
        <div className="tutor-topbar">
            <div className="left-info">
                <img src={avatar} alt="profile" className="tutor-avatar" />
                <div className="tutor-name-rating">
                    <h2>{name}</h2>
                    <div className="stars">
                        {[...Array(rating)].map((_, i) => (
                            <FaStar key={i} color="#f5ba13" />
                        ))}
                        {[...Array(5 - rating)].map((_, i) => (
                            <FaStar key={i} color="#ddd" />
                        ))}
                    </div>
                </div>
            </div>

            <div className="middle-info">
                <p className="label">Temas impartidos</p>
                <div className="subject-tags">
                    {subjects.map((subj, i) => (
                        <span key={i} className="tag">{subj}</span>
                    ))}
                </div>
            </div>

            <div className="right-info">
                <p className="price-label">Precio por hora:</p>
                <div className="price-pill">${price}</div>
                <p className="schedule-label">Horario:</p>
                <ul className="schedule-list">
                    {schedule.map((s, i) => (
                        <li key={i}>{s}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default TutorTopBar;
