import React, { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { ScreenContext } from "../contexts/ScreenContext";
import "../css/loginscreen.css";

function LoginScreen() {

    const { user, setUser } = useContext(UserContext);
    const { setCurrentScreen } = useContext(ScreenContext);

    function handleChange(event){
        setUser(event.target.value);
    }

    function logIntoStudent() {
        if (user === "estudiante") {
            setCurrentScreen("Search");
        }
        if (user === "tutor") {
            setCurrentScreen("Tutor")
        }
    }

    return (
        <div className="login-screen">
            <img src="/images/signinyellow1.svg" alt="Decoración" />

            <h1>StudyCircle</h1>
            <h2>Resuelve tus dudas de ingeniería</h2>

            <div className="inputs-container">
                <div className="input-container">
                    <label htmlFor="user">Usuario</label>
                    <input id="user" type="text" placeholder="Ingresa tu usuario" onChange={handleChange} />
                </div>

                <div className="input-container">
                    <label htmlFor="password">Contraseña</label>
                    <input id="password" type="password" placeholder="Ingresa tu contraseña" />
                </div>
            </div>

            <button className="login-button" onClick={logIntoStudent}>Iniciar sesión</button>
        </div>
    );
}

export default LoginScreen;
