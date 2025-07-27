import React, { useState, useContext, useEffect } from "react";
import Header from "../Common/Header";
import StudentSidebar from "../Common/StudentSidebar";
import {useNavigate} from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { SidebarContext } from "../../contexts/SidebarContext";
import ContinueSessionModal from "./ContinueSessionModal.jsx";
import "../../css/PaymentMethodStyles/paymentmethodscreen.css";
import axios from "axios";

function PaymentMethodScreen() {
  const location = useLocation();
  const flow = location.state?.flow || "settings"; 
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [ paymentDetails, setPaymentDetails ] = useState({
    card_number: "",
    card_holder: "",
    expiration_date: "",
    security_code: "",
    paypal_email: ""
  });
  const [showForm, setShowForm] = useState(false);
  const { user } = useUser();
  const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.user_id) return;
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/student-payment-methods/${user.user_id}`)
      .then(response => {
        setPaymentDetails(response.data || {});
        console.log("Payment details fetched:", response.data);
      })
      .catch(error => {
        console.error("Error fetching payment details:", error);
      });
  }, [user]);

  function handleSelection(method){
    setSelectedMethod(method);
    setShowForm(true);
  };

  function handleSubmit(event) {
    event.preventDefault();
    const studentId = user.user_id;
    const form = event.target;
    let payload; 

    if (selectedMethod === "card") {
      payload = {
        student_id: studentId,
        card_number: form.card_number.value,
        card_holder: form.card_holder.value,
        expiration_date: form.expiration_date.value,
        security_code: form.security_code.value
      };
    } else if (selectedMethod === "paypal") {
      payload = {
        student_id: studentId,
        paypal_email: form.paypal_email.value
      };
    }

    axios.post(`${process.env.REACT_APP_BACKEND_URL}/student-payment-methods/${studentId}`, payload)
      .then(response => {
        if (flow === "pay") {
          console.log("modal will render");
          setShowContinueModal(true);
        }
        else {
          navigate("/");
        }
      })
      .catch(error => {
        console.error("Error saving payment method:", error);
    });
  }

  return (
    <div>
      <Header/>
      <div className="payment-screen">
            
        <h1>Selecciona un método de pago</h1>

        {flow === "settings" && (
          <div className="info-box">
            No te preocupes, puedes poner cualquier cosa, es solo una simulación del pago.
        </div>
        )}
        {flow === "pay" && (
          <div className="info-box">
           Si no pagas la tutoría, tu cuenta será reportada y suspendida.
          </div>
        )}

        <div className="payment-content">
            <div className="payment-options">
            <button onClick={() => handleSelection("card")}>💳 Tarjeta de crédito</button>
            <button onClick={() => handleSelection("paypal")}>🅿️ PayPal</button>
            </div>

            {showForm && (
            <form className="payment-form" onSubmit={handleSubmit}>
              {selectedMethod === "card" && (
                <>
                  <label>Número de tarjeta</label>
                  <input type="text" name="card_number" defaultValue={paymentDetails.card_number || ""} placeholder="0000 0000 0000 0000" />

                  <label>Nombre del titular</label>
                  <input type="text" name="card_holder" defaultValue={paymentDetails.card_holder || ""} placeholder="Nombre completo" />

                  <label>Fecha de expiración</label>
                  <input type="month" name="expiration_date" defaultValue={paymentDetails.expiration_date || ""} />

                  <label>Código de seguridad</label>
                  <input type="text" name="security_code" defaultValue={paymentDetails.security_code || ""} placeholder="CVV" />
                </>
              )}

              {selectedMethod === "paypal" && (
                <>
                  <label>Correo de PayPal</label>
                  <input type="email" name="paypal_email" defaultValue={paymentDetails.paypal_email || ""} placeholder="usuario@correo.com" />
                </>
              )}
              {flow === "pay" && (
                 <button type="submit" className="pay-button">Pagar</button>
              )}
              {flow === "settings" && (
                <button type="submit" className="save-button">Guardar</button>
              )}

            </form>
            )}
        </div>
      </div>
      {showContinueModal && (
        <ContinueSessionModal
          isOpen={showContinueModal}
          onContinue={() => {
            setShowContinueModal(false);
            navigate("/");
          }}
          onCancel={() => setShowContinueModal(false)}
        />
      )}
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
