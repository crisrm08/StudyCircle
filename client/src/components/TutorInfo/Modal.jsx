import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { MdEdit } from "react-icons/md";
import { FaAngleLeft } from "react-icons/fa";
import Request from "./Request";
import "../../css/studentProfileStyles/modal.css";

function Modal({ tutor }) {
  const { image, name, institution, occupation, academicLevel, description, pricePerHour, rating } = tutor;
  const [ renderRequest, setRenderRequest ] = useState(false);
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();

  const renderStars = () => {
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

  function goToEdit() {
    navigate("/edit-ttr-profile");
  }

  function goBack() {
    navigate("/results");
  }

  function openRequestModal() {
    setRenderRequest(true);
  }

  function closeRequestModal() {
    setRenderRequest(false);
  }

  return (
    <div className="modal-content">

      <img src={image} alt={`Foto de ${name}`} className="modal-image" />
      {role === "Tutor" && ( <MdEdit className="edit-icon" size={30} onClick={goToEdit}/>)}
     
      <h2 className="modal-name">{name}</h2>
      <p className="modal-occupation">{occupation} - {institution} - {academicLevel}</p>

      {tutor.specialties?.length > 0 && (
        <div className="modal-specialties">
          {tutor.specialties.map((topic, index) => (
            <span key={index} className="specialty-pill">{topic}</span>
          ))}
        </div>
      )}

      <div className="modal-rating"> {renderStars()} <span className="rating-number">({rating.toFixed(1)})</span> </div>

      <p className="modal-description">{description}</p>
      <p className="modal-price"> <strong>Precio por hora:</strong> RD${pricePerHour} </p>
      <div className="modal-button-container">
        {role === "Student" && ( <button className="back-button" style={{marginTop: 15}} onClick={goBack}><FaAngleLeft/> Volver</button>)}
        {role === "Student" && ( <button className="tutor-button" style={{marginTop: 15}} onClick={openRequestModal}> Solicitar tutoría</button>)}
      </div>

      {renderRequest === true && (<Request onClose={closeRequestModal}/>)}
    </div>
  )
}

export default Modal;
