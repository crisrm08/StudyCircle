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
        <div className="LogSign">
            <h1 className="title">StudyCircle</h1>

            <div className="login-screen">
                <div className="login-form">
                    <h2>Inicia sesión en tu cuenta</h2>
                    <h3>Inicia sesión con tu cuenta de google</h3>

                    <img src="images/googleLogo.webp" alt="google logo" />
                    <div className="separator2"> <span>O</span> </div>
                    <div className="inputs-container">
                        <div className="input-container">
                            <input id="user" type="text" placeholder="Ingresa tu usuario" onChange={handleChange} />
                        </div>

                        <div className="input-container">
                            <input id="password" type="password" placeholder="Ingresa tu contraseña" />
                        </div>
                    </div>

                <button className="login-button" onClick={logIntoStudent}>Iniciar sesión</button>

                <p>Click aquí si olvidaste tu contraseña</p>
                </div>
            </div>
            <div className="login-screen2">
                <div className="centered-container">
                    <h1>¿Eres nuevo aquí?</h1>
                    <p>Regístrate y conoce a tus futuros tutores</p>
                    <button>Comenzar</button>

                    <div className="separator"> <span>O</span> </div>

                    <p>Regístrate y empieza tu camino como tutor</p>
                    <button>Comenzar</button>
                </div>
            </div>

        </div>
    );
}

export default LoginScreen;
