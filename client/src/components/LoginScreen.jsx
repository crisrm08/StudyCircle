import React from "react";
import "../css/loginscreen.css";

function LoginScreen() {
  return (
    <div className="login-screen">
        <img src="/images/signinyellow1.svg" alt="Decoración" />

        <h1>StudyCircle</h1>
        <h2>Resuelve tus dudas de ingeniería</h2>

        <div className="inputs-container">
            <div className="input-container">
            <label htmlFor="user">Usuario</label>
            <input id="user" type="text" placeholder="Ingresa tu usuario" />
            </div>

            <div className="input-container">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" placeholder="Ingresa tu contraseña" />
            </div>
        </div>

        <button className="login-button">Iniciar sesión</button>
    </div>
  );
}

export default LoginScreen;
