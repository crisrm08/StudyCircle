import React from "react";
import '../../css/forgotPWDStyles/forgotpwdscreen.css';

function ForgotPWDScreen() {

    return(
       <div className="Log-Sign-Frgt">
            <h1 className="title">StudyCircle</h1>
            
            <div className="login-forgotPWD-screen">
                <div className="forgotPWD-form login-forgotPWD-form">
                    <h2>Ingresa tu correo</h2>
                    <h3>Te enviaremos un link para que puedas restablecer tu contraseña. </h3>

                    <div className="inputs-container">
                        <div className="input-container">
                            <input id="user" type="text" placeholder="email 📩"/>
                        </div>
                    </div>

                    <button className="forgotPWD-button login-forgotPWD-button">Enviar</button>
                </div>
            </div>
            <div className="login-forgotPWD-screen2">
                <div className="forgotPWDcentered-container centered-container">
                    <h1>Tu plataforma favorita para aprender</h1>
                    <img src="images/forgot-pwd-icon.svg" alt="icon" />
                </div>
            </div>
        </div>
    )
}

export default ForgotPWDScreen;