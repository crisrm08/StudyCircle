import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import axios from "axios";
import "../../css/studentProfileStyles/modal.css";
import { useEffect } from "react";

function StudentFactsModal({student}) {
  const { name, last_name, institution, degree, strengths, weaknesses, rating, description, reports, image } = student;
  const navigate = useNavigate();
  const [reportsCount, setReportsCount] = useState(reports);

  function backToHome(){
    navigate(-1);
  };

  function renderStars(){
    const filledStars = Math.floor(rating);
    const hasHalfStar = rating - filledStars >= 0.5;
    const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);
    const stars = [];

    for (let i = 0; i < filledStars; i++) {
      stars.push(<span key={`filled-${i}`} className="star">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star">☆</span>);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  return (
    <div className="modal-content">
      <div
        className={`reports-indicator ${reportsCount > 0 ? "danger" : "safe"}`}
        title={
          reportsCount === 0
            ? "Este estudiante nunca ha sido reportado"
            : `Este estudiante ha sido reportado ${reportsCount} ${reportsCount === 1 ? "vez" : "veces"}`
        }
      >
        {reportsCount === 0 ? "✔️" : "⚠️"} {reportsCount} reportes
      </div>

      <img src={image} alt={`Foto de ${name}`} style={{width: 100, height: 100 }} className="modal-image"/>

      <h2 className="modal-name">{name} {last_name}</h2>
      <p className="modal-occupation">{institution} - {degree}</p>

      <h2 className="modal-strengths-title" >Destrezas</h2>
      {strengths?.length > 0 && (
        <div className="modal-specialties">
          {strengths.map((topic, index) => (
            <span key={index} className="specialty-pill">{topic}</span>
          ))}
        </div>
      )}

      <h2 className="modal-weaknesses-title" >Debilidades</h2>
      {weaknesses?.length > 0 && (
        <div className="modal-specialties">
          {weaknesses.map((topic, index) => (
            <span key={index} className="weakness-pill">{topic}</span>
          ))}
        </div>
      )}

      <div className="modal-rating"> {renderStars()} <span className="rating-number">({rating.toFixed(1)})</span> </div>
      <p style={{marginBottom:'0px'}} className="modal-description">{description}</p>
      <div className="modal-button-container">
        <button className="back-button" style={{marginTop: 15}} onClick={backToHome}><FaAngleLeft/> Volver</button>
      </div>
    </div>
  )
}

export default StudentFactsModal;
