import React from "react";
import "../css/studentsignup.css";
import { PiStudentFill } from "react-icons/pi";

function StudentSignUp1Screen() {
    return(
        <div className="Student-sign-up-1">
            <h1 className="title">StudyCircle</h1>
            <div className="Sign-up-form">
                <div>
                    <form className="form-container">
                        <h1>Regístrate</h1>
                        <div></div>

                        <label htmlFor="name">Nombre(s)</label>
                        <input htmlFor="name" type="text" placeholder="Escribe tu(s) nombre(s)" />

                        <label htmlFor="last-name">Apellidos(s)</label>
                        <input htmlFor="last-name" type="last-name" placeholder="Escribe tu(s) apellido(s)" />

                        <label htmlFor="email">Correo electrónico</label>
                        <input htmlFor="email" type="text" placeholder="Escribe tu correo electrónico" />

                        <label htmlFor="password">Contraseña</label>
                        <input htmlFor="password" type="text" placeholder="Escribe tu contraseña" />

                        <label htmlFor="confirm-password">Reingrese contraseña</label>
                        <input htmlFor="confirm-password" type="text" placeholder="Escribe nuevamente tu contraseña" />

                        <button type="submit">Siguiente</button>
                    </form>
                    <PiStudentFill size={350} color="#163172"/>
                </div>
            </div>  
        </div>
    )
}

export default StudentSignUp1Screen;