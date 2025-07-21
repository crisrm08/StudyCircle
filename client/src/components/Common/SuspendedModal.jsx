import React from "react";
import "../../css/suspendedmodal.css";

function SuspendedModal({ onLogout }) {
  return (
    <div className="suspend-overlay">
      <div className="suspend-modal">
        <h2>Cuenta Suspendida</h2>
        <p>
          Tu cuenta ha sido suspendida por usos indebidos. <br/>
          Contacta al administrador para más información.
        </p>
        <button onClick={onLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
}

export default SuspendedModal;
