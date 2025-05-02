import React, {useContext, useState} from "react";
import "../css/signup.css";
import { PiStudentFill } from "react-icons/pi";
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { ScreenContext } from "../contexts/ScreenContext";

function StudentSignUp1Screen() {

    const { setCurrentScreen } = useContext(ScreenContext);
    const [visible, setVisible] = useState(false);

    function next() {
        setCurrentScreen("StudentSignUp2");
    }

    return(
        <div className="Student-sign-up-1">
            <h1 className="title">StudyCircle</h1>
            <div className="Sign-up-form">
                <div>
                    <form className="form-container" onSubmit={next}>
                        <h1>Regístrate</h1>
                        <div></div>

                        <label htmlFor="name">Nombre(s)</label>
                        <input htmlFor="name" type="text" placeholder="Escribe tu(s) nombre(s)" />

                        <label htmlFor="last-name">Apellidos(s)</label>
                        <input htmlFor="last-name" type="last-name" placeholder="Escribe tu(s) apellido(s)" />

                        <label htmlFor="email">Correo electrónico</label>
                        <input htmlFor="email" type="text" placeholder="Escribe tu correo electrónico" />

                        <label htmlFor="password">Contraseña</label>
                        <div className="input-with-icon">
                            <input id="password" type={visible ? "text" : "password"} placeholder="Escribe tu contraseña"/>
                            <button
                                type="button"
                                className="eye-toggle"
                                onClick={() => setVisible(previousValue => !previousValue)}
                                aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {visible ? <LuEyeClosed size={26} /> : <LuEye size={26}/>}
                            </button>
                        </div>

                        <label htmlFor="confirm-password">Reingrese contraseña</label>
                        <div className="input-with-icon">
                            <input id="confirm-password" type={visible ? "text" : "password"} placeholder="Escribe nuevamente tu contraseña"/>
                            <button
                                type="button"
                                className="eye-toggle"
                                onClick={() => setVisible(previousValue => !previousValue)}
                                aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {visible ? <LuEyeClosed size={26} /> : <LuEye size={26} />}
                            </button>
                        </div>

                        <button type="submit">Siguiente</button>
                    </form>
                    <PiStudentFill size={350} color="#163172"/>
                </div>
            </div>  
        </div>
    )
}

export default StudentSignUp1Screen;