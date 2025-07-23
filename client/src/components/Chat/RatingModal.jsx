import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/chatStyles/ratingmodal.css";
import { FaStar } from "react-icons/fa";

function RatingModal({ isOpen, onClose, onSubmit, loggedUserRole }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  function handleSubmit(event){
    event.preventDefault();
    if (rating === 0) return alert("Por favor, selecciona una puntuación.");
    onSubmit({ rating, comment });
    onClose();
  };

  function handleTutorPayment() {
    console.log("Tutor payment logic goes here");
    navigate("/payment-method");
  }

  return (
    <div className="modal-overlay">
      <div className="rating-modal">
        <h2>Califica la tutoría</h2>
        <p>Selecciona una puntuación de 1 a 5 estrellas y deja un comentario</p>

        <div className="stars-container">
          {[...Array(5)].map((_, index) => {
            const value = index + 1;
            return (
              <label key={value}>
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  onClick={() => setRating(value)}
                />
                <FaStar
                  className="star"
                  color={value <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(null)}
                />
              </label>
            );
          })}
        </div>

        <textarea
          placeholder="Escribe tu comentario aquí..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="modal-buttons">
           <button
              onClick={(e) => {
                handleSubmit(e);
                if (loggedUserRole === "student") { handleTutorPayment()}
              }}
            >
              {loggedUserRole === "student"
                ? "Pagar y calificar tutoría"
                : "Enviar"}
        </button>
          <button onClick={onClose} className="cancel">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default RatingModal;
