import React from "react";
import { FaStar } from "react-icons/fa";
import "../../css/tutorInfoStyles/tutorreviews.css";

function StudentCritiques({ reviews = [] }) {
  return (
    <div className="tutor-reviews">
      <div className="tutor-reviews__scroll">
        <h2>Reseñas</h2>
        <hr />
        {reviews.length === 0 ? (
          <p className="no-reviews-message">
            Este estudiante aún no tiene reseñas.
          </p>
        ) : (
          <div className="reviews-list">
            {reviews.map((review, index) => (
              <div key={index} className="review-card">
                <div className="review-header">
                  <img src={review.avatar} alt={`${review.name} avatar`} />
                  <div>
                    <h3>{review.name}</h3>
                    <div className="stars">
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} color="#f5ba13" />
                      ))}
                    </div>
                  </div>
                </div>
                <p>{review.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentCritiques;


