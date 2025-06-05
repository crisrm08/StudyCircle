import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/signUpStyles/signupmodal.css";

function SignUpModal({ isOpen, onClose }) {
    const navigate = useNavigate();

    function handleOkClick() {
        onClose();
        navigate("/login");
    };

    if (!isOpen) return null;
    
    return (
        <div className="sign-up-modal">
            <h2>Te hemos enviado un correo de verificación. Revisa tu bandeja de entrada y, si no lo encuentras, revisa también la carpeta de spam o correo no deseado</h2>
            <img src="images/logo.png" alt="Logo StudyCircle" />
            <button onClick={handleOkClick}>Ok</button>
        </div>
    );
}

export default SignUpModal;