import React, { useState, useContext } from "react";
import Header from "../Common/Header";
import { useNavigate } from "react-router-dom";
import TutorSidebar from "../Common/TutorSidebar";
import { SidebarContext } from "../../contexts/SidebarContext";
import "../../css/TutorPaymentStyles/tutorpayments.css";

function TutorPaymentScreen() {
  const [selectedMethod, setSelectedMethod] = useState(null);
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

  function handleSubmit(event) {
    event.preventDefault();
    setShowToast(true);

    setTimeout(() => {
      navigate("/tutor-home-page");
    }, 2000); 
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
