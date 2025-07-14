import React from "react";
import "../../css/resultsStyle/tutorprofilecard.css";

function TutorProfileCard({ id, image, name, occupation, description, pricePerHour, rating, onExplore, specialties}) {

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

  function handleClick() {
    onExplore();
  }

  return (
    <div className="tutor-card" onClick={handleClick}>
      <img src={image} alt={`Foto de ${name}`} className="tutor-image" />
      
      <div className="tutor-info">
        <h2 className="tutor-name">{name}</h2>
        <p className="tutor-occupation">{occupation}</p>
        <div className="tutor-rating">
          {renderStars()} <span className="rating-number">({rating.toFixed(1)})</span>
        </div>
        <p className="tutor-description">{description}</p>
        <p className="modal-price"> <strong>Precio por hora:</strong> RD${pricePerHour} </p>
      </div>

      <button className="tutor-button">Más información</button>
    </div>
  );
}

export default TutorProfileCard;
