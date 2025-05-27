import React, { useState, useContext } from "react";
import Header from "../Common/Header";
import StudentSidebar from "../Common/StudentSidebar";
import { SidebarContext } from "../../contexts/SidebarContext";
import "../../css/PaymentMethodStyles/paymentmethodscreen.css";

function PaymentMethodScreen() {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
  
  function handleSelection(method){
    setSelectedMethod(method);
    setShowForm(true);
  };

  return (
    <div>
      <Header/>
      <div className="payment-screen">
            
        <h1>Selecciona un método de pago</h1>

        <div className="info-box">
            No te preocupes, el tutor no recibirá el pago hasta que hayas confirmado que recibiste la tutoría.
        </div>

        <div className="payment-content">
            <div className="payment-options">
            <button onClick={() => handleSelection("card")}>💳 Tarjeta de crédito</button>
            <button onClick={() => handleSelection("paypal")}>🅿️ PayPal</button>
            <button onClick={() => handleSelection("cash")}>💵 Efectivo</button>
            </div>

            {showForm && (
            <form className="payment-form">
              {selectedMethod === "card" && (
                <>
                  <label>Número de tarjeta</label>
                  <input type="text" placeholder="0000 0000 0000 0000" />

                  <label>Nombre del titular</label>
                  <input type="text" placeholder="Nombre completo" />

                  <label>Fecha de expiración</label>
                  <input type="month" />

                  <label>Código de seguridad</label>
                  <input type="text" placeholder="CVV" />
                </>
              )}

              {selectedMethod === "paypal" && (
                <>
                  <label>Correo de PayPal</label>
                  <input type="email" placeholder="usuario@correo.com" />
                </>
              )}

              {selectedMethod === "cash" && (
                <p className="info">Se reservará tu tutoría. El pago se coordinará directamente con el tutor.</p>
              )}

              <button type="submit" className="pay-button">Pagar</button>
            </form>
            )}
        </div>
      </div>
      {isSidebarClicked && (
          <>
              <div className="overlay" onClick={() => setIsSidebarClicked(false)}/>
              <StudentSidebar />
          </>
      )}
    </div>

  );
}

export default PaymentMethodScreen;
