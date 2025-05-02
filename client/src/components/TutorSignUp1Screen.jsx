import React, {useContext, useState} from "react";
import "../css/signup.css";
import { GiTeacher } from "react-icons/gi";
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { ScreenContext } from "../contexts/ScreenContext";

function TutorSignUp1Screen() {

    const { setCurrentScreen } = useContext(ScreenContext);
    const [visible, setVisible] = useState(false);

    function next() {
        setCurrentScreen("TutorSignUp2");
    }

    return(
        <div className="Student-sign-up-1" style={{backgroundColor:"#D6E4F0"}}>
            <h1 className="title" style={{color:"#163172"}}>StudyCircle</h1>
            <div className="Sign-up-form" style={{backgroundColor:"#163172"}}>
                <div>
                    <form className="form-container" onSubmit={next}>
                        <h1 style={{color:"#D6E4F0"}}>Regístrate</h1>
                        <div></div>

                        <label htmlFor="name" style={{color:"#D6E4F0"}}>Nombre(s)</label>
                        <input htmlFor="name" type="text" placeholder="Ingrese su(s) nombre(s)" />

                        <label htmlFor="last-name" style={{color:"#D6E4F0"}}>Apellidos(s)</label>
                        <input htmlFor="last-name" type="last-name" placeholder="Escriba su(s) apellido(s)" />

                        <label htmlFor="email" style={{color:"#D6E4F0"}}>Correo electrónico</label>
                        <input htmlFor="email" type="text" placeholder="Escriba su correo electrónico" />

                        <label htmlFor="password" style={{color:"#D6E4F0"}}>Contraseña</label>
                        <div className="input-with-icon">
                            <input id="password" type={visible ? "text" : "password"} placeholder="Ingrese su contraseña"/>
                            <button
                                type="button"
                                className="eye-toggle"
                                onClick={() => setVisible(previousValue => !previousValue)}
                                aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {visible ? <LuEyeClosed size={26}/> : <LuEye size={26}/>}
                            </button>
                        </div>

                        <label htmlFor="confirm-password" style={{color:"#D6E4F0"}}>Reingrese contraseña</label>
                        <div className="input-with-icon">
                            <input id="confirm-password" type={visible ? "text" : "password"} placeholder="Ingrese nuevamente su contraseña"/>
                            <button
                                type="button"
                                className="eye-toggle"
                                onClick={() => setVisible(previousValue => !previousValue)}
                                aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {visible ? <LuEyeClosed size={26}/> : <LuEye  size={26}/>}
                            </button>
                        </div>

                        <button type="submit" className="next">Siguiente</button>
                    </form>
                    <GiTeacher size={350} color="#D6E4F0"/>
                </div>
            </div>  
        </div>
    )
}

export default TutorSignUp1Screen;