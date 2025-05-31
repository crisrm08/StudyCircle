import React, {useContext, useState} from "react";
import { StudentSignUpContext } from "../../contexts/StudentSignUpContext";
import { PiStudentFill } from "react-icons/pi";
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { IoIosWarning } from "react-icons/io";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "../../css/signUpStyles/signup.css";


function StudentSignUp1Screen() {
    const [visible, setVisible] = useState(false);
    const [confirm, setConfirm] = useState("");
    const [match, setMatch] = useState(false);
    const [startedTypingConfirm, setStartedTypingConfirm] = useState(false);
    const { studentSignUpData, setStudentSignUpData } = useContext(StudentSignUpContext);
    const navigate = useNavigate();

    function handleChangePwd(event) {
        const userInput = event.target.value;
        setStudentSignUpData({ ...studentSignUpData, password: userInput });
        if (startedTypingConfirm) {
            setMatch(userInput === confirm);
        }
    }

    function handleChangeCf(event) {
        setStartedTypingConfirm(true);
        const typedPassword = event.target.value;
        setConfirm(typedPassword);
        setMatch(studentSignUpData.password === typedPassword);
    }

    function handleChangeName(event) {
        const typedName = event.target.value;
        setStudentSignUpData({ ...studentSignUpData, name: typedName });
    }

    function handleChangeLastName(event) {
        const typedLastName = event.target.value;
        setStudentSignUpData({ ...studentSignUpData, last_name: typedLastName });
    }

    function handleChangeEmail(event) {
        const typedEmail = event.target.value;
        setStudentSignUpData({ ...studentSignUpData, email: typedEmail });
    }

    function next(e) {
        e.preventDefault();
        navigate("/student-signup-2");
    }

    function goBack() {
        navigate(-1);
    }

    return(
        <div className="Student-sign-up-1">
            <h1 className="title" onClick={goBack}> <MdKeyboardArrowLeft size={50}/>StudyCircle</h1>
            <div className="Sign-up-form">
                <div>
                    <form className="form-container" onSubmit={next}>
                        <h1>Regístrate</h1>
                        <div></div>

                        <label htmlFor="name">Nombre(s)</label>
                        <input htmlFor="name" type="text" placeholder="Escribe tu(s) nombre(s)" value={studentSignUpData.name} onChange={handleChangeName}/>

                        <label htmlFor="last-name">Apellidos(s)</label>
                        <input htmlFor="last-name" type="last-name" placeholder="Escribe tu(s) apellido(s)" value={studentSignUpData.last_name} onChange={handleChangeLastName}/>

                        <label htmlFor="email">Correo electrónico</label>
                        <input htmlFor="email" type="text" placeholder="Escribe tu correo electrónico" value={studentSignUpData.email} onChange={handleChangeEmail}/>

                        <label htmlFor="password">Contraseña</label>
                        <div className="input-with-icon">
                            <input id="password" type={visible ? "text" : "password"} placeholder="Escribe tu contraseña" value={studentSignUpData.password} onChange={handleChangePwd}/>
                            <button
                                type="button"
                                className="eye-toggle"
                                onClick={() => setVisible(previousValue => !previousValue)}
                                aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {(startedTypingConfirm && !match &&  <IoIosWarning title="Las contraseñas no coinciden." style={{ cursor: 'help' }} />)}
                                {visible ? <LuEyeClosed size={26} /> : <LuEye size={26}/>}
                            </button>
                        </div>

                        <label htmlFor="confirm-password">Reingrese contraseña</label>
                        <div className="input-with-icon">
                            <input id="confirm-password" type={visible ? "text" : "password"} placeholder="Escribe nuevamente tu contraseña" value={confirm} onChange={handleChangeCf}/>
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