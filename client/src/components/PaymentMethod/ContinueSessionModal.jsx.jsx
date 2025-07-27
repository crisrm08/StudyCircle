import React from "react";
import { IoClose } from "react-icons/io5";
import "../../css/TutorPaymentStyles/continueSessionModal.css";

export default function ContinueSessionModal({ isOpen, onContinue, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="continue-session-overlay">
      <div className="continue-session-modal">
        <button className="close-btn" onClick={onCancel} title="Cerrar">
          <IoClose size={20} />
        </button>
        <h2>¿Quieres seguir trabajando con este tutor?</h2>
        <p>
          Encuéntralo fácilmente en la sección de "finalizdos" del chat o en tu historial y agenda tu próxima sesión aquí  
          para mantener tus beneficios y calificaciones.
        </p>
        <div className="continue-session-buttons">
          <button className="btn btn-primary" onClick={onContinue}>
            Ok
          </button>
        </div>
      </div>
    </div>
  );
}
