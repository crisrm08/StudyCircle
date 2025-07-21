import React, { useState, useEffect } from "react";
import SuspendedModal from "../Common/SuspendedModal";
import { supabase } from "../Supabase/supabaseClient";
import { useUser } from "../../contexts/UserContext";
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "../../css/loginStyles/loginscreen.css";

function LoginScreen() {
    const { user, setUser } = useUser();
    const navigate = useNavigate();  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showSuspended, setShowSuspended] = useState(false);
    const [visible, setVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(
        window.innerWidth <= 768   
    );

    useEffect(() => {
        const onResize = () => {
        setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);


    function handleEmailChange(event){
        setEmail(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return alert("Login falló: " + error.message);

        const token = data.session.access_token;
        const resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {}, { headers: { Authorization: `Bearer ${token}` } });
        const user = resp.data;

        if (user.suspended) {
            setShowSuspended(true);
            return;
        }

        setUser(user);
        if (user.profile_type === "student") navigate("/");
        else if (user.profile_type === "admin") navigate("/admin-reports");
        else navigate("/tutor-home-page");
    }

    
    async function handleGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
         options: { redirectTo: `${window.location.origin}/pick-role` }
        });
        if (error) console.error("OAuth error:", error.message);
    }

    function studentSignUp() {
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
            {showSuspended && 
            <SuspendedModal onLogout={async () => {
                await supabase.auth.signOut();
                setShowSuspended(false);
                navigate("/login");
            }}/>
            }

            <form className="login-forgotPWD-screen" onSubmit={handleSubmit}>
                <h1 className="title title-mobile">StudyCircle</h1>

                <div className="login-forgotPWD-form">
                    <h2>
                        {isMobile
                        ? "Inicia sesión o desliza hacia abajo y regístrate"
                        : "Inicia sesión en tu cuenta"}
                    </h2>
                    <h3>Inicia sesión o Regístrate con tu cuenta de google</h3>

                    <img src="images/googleLogo.webp" alt="google logo" onClick={handleGoogle} />
                    <div className="separator2"> <span>O</span> </div>
                    <div className="inputs-container">
                        <div className="input-container">
                            <input id="user" type="text" placeholder="Ingresa tu email" onChange={handleEmailChange} />
                        </div>

                        <div className="input-container">
                             <div className="input-with-icon">
                                <input id="password" type={visible ? "text" : "password"} placeholder="Ingresa tu contraseña" onChange={handlePasswordChange}/>
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

                    <button className="login-forgotPWD-button" type="submit">Iniciar sesión</button>
                    <p onClick={forgotPassword}>Click aquí si olvidaste tu contraseña</p>
                </div>
            </form>
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
