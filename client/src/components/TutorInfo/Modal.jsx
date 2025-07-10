import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { FaAngleLeft } from "react-icons/fa";
import Request from "./Request";
import { useUser } from "../../contexts/UserContext";
import "../../css/studentProfileStyles/modal.css";

function Modal({ tutor }) {
  const { image, name, last_name, institution, occupation, academicLevel, description, pricePerHour, rating, specialties } = tutor;
  const [ renderRequest, setRenderRequest ] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

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

  function goToEdit() {
    navigate("/edit-tutor-profile");
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
      {user.profile_type === "tutor" && ( <MdEdit className="edit-icon" size={30} onClick={goToEdit}/>)}
     
      <h2 className="modal-name">{name} {last_name}</h2>
      <p className="modal-occupation">{occupation} - {institution} - {academicLevel}</p>

      {specialties?.length > 0 && (
        <div className="modal-specialties">
          {specialties.map((topic, index) => (
            <span key={index} className="specialty-pill">{topic}</span>
          ))}
        </div>
      )}

      <div className="modal-rating"> {renderStars()} <span className="rating-number">({rating.toFixed(1)})</span> </div>

      <p className="modal-description">{description}</p>
      <p className="modal-price"> <strong>Precio por hora:</strong> RD${pricePerHour} </p>
      <div className="modal-button-container">
        {user.profile_type === "student" && ( <button className="back-button" style={{marginTop: 15}} onClick={goBack}><FaAngleLeft/> Volver</button>)}
        {user.profile_type === "student" && ( <button className="tutor-button" style={{marginTop: 15}} onClick={openRequestModal}> Solicitar tutoría</button>)}
      </div>

      {renderRequest === true && (<Request onClose={closeRequestModal}/>)}
    </div>
  )
}

export default Modal;
