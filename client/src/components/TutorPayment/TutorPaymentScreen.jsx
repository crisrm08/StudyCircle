import React, { useState, useContext } from "react";
import Header from "../Common/Header";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import TutorSidebar from "../Common/TutorSidebar";
import { SidebarContext } from "../../contexts/SidebarContext";
import "../../css/TutorPaymentStyles/tutorpayments.css";
import axios from "axios";
import { useEffect } from "react";

function TutorPaymentScreen() {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [ cashingDetails, setCashingDetails ] = useState({
    bank_name: "",
    account_holder: "",
    account_number: "",
    account_type: "",
    paypal_email: ""
  });
  const { user } = useUser();
  const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
  const [ showToast, setShowToast ] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.user_id) return;

    axios.get(`http://localhost:5000/tutor-cashing-methods/${user.user_id}`)
      .then(response => {
        setCashingDetails(response.data || {});
      })
      .catch(error => {
        console.error("Error fetching cashing details:", error);
      });
  }, [user]);

  function renderForm() {
    switch (selectedMethod) {
      case "bank":
        return (
          <form key="bank" className="payment-form" onSubmit={handleSubmit}>
            <label>Nombre del banco</label>
            <input
              type="text"
              name="bank_name"
              placeholder="ej: Banco de Ejemplo"
              defaultValue={cashingDetails.bank_name ? cashingDetails.bank_name : ""}
            />

            <label>Nombre del titular</label>
            <input
              type="text"
              name="account_holder"
              placeholder="ej: Juan Pérez"
              defaultValue={cashingDetails.account_holder ? cashingDetails.account_holder : ""}
            />

            <label>Número de cuenta</label>
            <input
              type="text"
              name="account_number"
              placeholder="ej: 000-123456789-0"
              defaultValue={cashingDetails.account_number ? cashingDetails.account_number : ""}
            />

            <label>Tipo de cuenta</label>
            <select
              name="account_type"
              defaultValue={cashingDetails.account_type || "Ahorros"}
            >
              <option value="Ahorros">Ahorros</option>
              <option value="Corriente">Corriente</option>
            </select>

            <button type="submit" className="save-method-button">
              Guardar método
            </button>
          </form>
        );
      case "paypal":
        return (
          <form key="paypal" className="payment-form" onSubmit={handleSubmit}>
            <label>Correo de PayPal</label>
            <input
              type="email"
              name="paypal_email"
              placeholder="ejemplo@correo.com"
              defaultValue={cashingDetails.paypal_email || ""}
            />
            <button type="submit" className="save-method-button">
              Guardar método
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  if (!user || !user.user_id) return null

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const tutorId = user.user_id;

    let payload;
    if (selectedMethod === "bank") {
      payload = {
        bank_name: form.bank_name.value,
        account_holder: form.account_holder.value,
        account_number: form.account_number.value,
        account_type: form.account_type.value,
        paypal_email:   cashingDetails.paypal_email || ""
      };
    } else if (selectedMethod === "paypal") {
      payload = {
        bank_name: cashingDetails.bank_name,
        account_holder: cashingDetails.account_holder,
        account_number: cashingDetails.account_number,
        account_type: cashingDetails.account_type,
        paypal_email: form.paypal_email.value
      };
    } else {
      return; 
    }
    axios.post(`http://localhost:5000/tutor-cashing-methods/${tutorId}`, payload)
    .then(response => {
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
