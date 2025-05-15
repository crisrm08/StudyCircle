import React, { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import "../css/loginscreen.css";

function LoginScreen() {

    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();  
    const [visible, setVisible] = useState(false);

    function handleChange(event){
        setUser(event.target.value);
    }

    function logIntoStudent() {
        if (user === "estudiante") {
            navigate("/");
        }
        if (user === "tutor") {
            navigate("/tutor-home-page");
        }
    }

    function studentSignUp(){
        navigate("/student-signup-1");
    }

    function tutorSignUp() {
        navigate("/tutor-signup-1");
    }

    function forgotPassword() {
        navigate("/forgot-pwd");
    }

    return (
        <div className="Log-Sign-Frgt">
            <h1 className="title">StudyCircle</h1>

            <div className="login-forgotPWD-screen">
                <div className="login-forgotPWD-form">
                    <h2>Inicia sesión en tu cuenta</h2>
                    <h3>Inicia sesión con tu cuenta de google</h3>

                    <img src="images/googleLogo.webp" alt="google logo" />
                    <div className="separator2"> <span>O</span> </div>
                    <div className="inputs-container">
                        <div className="input-container">
                            <input id="user" type="text" placeholder="Ingresa tu usuario 👩🏻‍💻" onChange={handleChange} />
                        </div>

                        <div className="input-container">
                             <div className="input-with-icon">
                                <input id="password" type={visible ? "text" : "password"} placeholder="Ingresa tu contraseña 🔐"/>
                                <button
                                    type="button"
                                    className="eye-toggle"
                                    onClick={() => setVisible(previousValue => !previousValue)}
                                    style={{top:"23px"}}
                                    aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {visible ? <LuEyeClosed size={26}/> : <LuEye size={26} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button className="login-forgotPWD-button" onClick={logIntoStudent}>Iniciar sesión</button>
                    <p onClick={forgotPassword}>Click aquí si olvidaste tu contraseña</p>
                </div>
            </div>
            <div className="login-forgotPWD-screen2">
                <div className="centered-container">
                    <h1>¿Eres nuevo aquí?</h1>
                    <p>Regístrate y conoce a tus futuros tutores</p>
                    <button onClick={studentSignUp}>Comenzar</button>

                    <div className="separator"> <span>O</span> </div>

                    <p>Regístrate y empieza tu camino como tutor</p>
                    <button onClick={tutorSignUp}>Comenzar</button>
                </div>
            </div>
        </div>
    );
}

export default LoginScreen;
