import React from "react";
import "../css/modal.css";

function Modal({ tutor, onClose }) {
  const { image, name, occupation, description, pricePerHour, rating } = tutor;

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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <img src={image} alt={`Foto de ${name}`} className="modal-image" />
        
        <h2 className="modal-name">{name}</h2>
        <p className="modal-occupation">{occupation}</p>

        <div className="modal-rating">
          {renderStars()} <span className="rating-number">({rating.toFixed(1)})</span>
        </div>

        <p className="modal-description">{description}</p>
        
        <p className="modal-price">
          <strong>Precio por hora:</strong> RD${pricePerHour}
        </p>
      </div>
    </div>
  );
}

export default Modal;
