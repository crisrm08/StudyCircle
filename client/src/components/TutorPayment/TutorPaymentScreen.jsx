import React, { useState, useContext } from "react";
import Header from "../Common/Header";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import TutorSidebar from "../Common/TutorSidebar";
import { SidebarContext } from "../../contexts/SidebarContext";
import "../../css/TutorPaymentStyles/tutorpayments.css";
import axios from "axios";

function TutorPaymentScreen() {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const { user } = useUser();
  const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
  const [ showToast, setShowToast ] = useState(false)
  const navigate = useNavigate();

  function renderForm() {
    switch (selectedMethod) {
      case "bank":
        return (
          <form className="payment-form" onSubmit={handleSubmit}>
            <label>Nombre del banco</label>
            <input type="text" placeholder="Banco Popular" />

            <label>Nombre del titular</label>
            <input type="text" placeholder="Juan Pérez" />

            <label>Número de cuenta</label>
            <input type="text" placeholder="000-123456789-0" />

            <label>Tipo de cuenta</label>
            <select>
              <option>Ahorros</option>
              <option>Corriente</option>
            </select>

            <button type="submit" className="save-method-button">Guardar método</button>
          </form>
        );
      case "paypal":
        return (
          <form className="payment-form" onSubmit={handleSubmit}>
            <label>Correo de PayPal</label>
            <input type="email" placeholder="ejemplo@correo.com" />
            <button type="submit" className="save-method-button">Guardar método</button>
          </form>
        );

      default:
        return null;
    }
  };

  if (!user || !user.user_id) return null

  function handleSubmit(event) {
    event.preventDefault();
    const tutorId = user.user_id;

    axios.post(`http://localhost:5000/tutor-cashing-methods/${tutorId}`, {
      bank_name: event.target[0] ? event.target[0].value : null,
      account_holder: event.target[1] ? event.target[1].value : null,
      account_number: event.target[2] ? event.target[2].value : null,
      account_type: event.target[3] ? event.target[3].value : null,
      paypal_email: event.target[4] ? event.target[4].value : null,
    })
    .then(response => {
      console.log("Método de cobro guardado:", response.data);
      setShowToast(true);

      setTimeout(() => {
        navigate("/tutor-home-page");
      }, 2000); 
    })
    .catch(error => {
      console.error("Error guardando método de cobro:", error);
    });
  }

  return (
    <div>
      <Header />
      <div className="tutor-payment-screen">
        <h1>Configura tu método de cobro</h1>

        <div className="method-selector">
          <button onClick={() => setSelectedMethod("bank")}>🏦 Cuenta Bancaria</button>
          <button onClick={() => setSelectedMethod("paypal")}>🅿️ PayPal</button>
        </div>

        {renderForm()}
      </div>
      {showToast && <div className="toast">✅ Cambios guardados</div>}
      {isSidebarClicked && (
          <>
              <div className="overlay" onClick={() => setIsSidebarClicked(false)}/>
              <TutorSidebar />
          </>
      )}
    </div>
  );
}

export default TutorPaymentScreen;
