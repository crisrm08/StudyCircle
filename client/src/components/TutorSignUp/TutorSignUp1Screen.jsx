import React, {useState, useContext} from "react";
import "../../css/signUpStyles/signup.css";
import { FaChalkboardTeacher } from "react-icons/fa";
import { TutorSignUpContext } from "../../contexts/TutorSignUpContext";
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { IoIosWarning } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";

function TutorSignUp1Screen() {

    const [visible, setVisible] = useState(false);
    const [confirm, setConfirm] = useState("");
    const [match, setMatch] = useState(false);
    const [startedTypingConfirm, setStartedTypingConfirm] = useState(false);
    const { tutorSignUpData, setTutorSignUpData } = useContext(TutorSignUpContext);
    const navigate = useNavigate();

    function handleChangePwd(event) {
        const userInput = event.target.value;
        setTutorSignUpData({ ...tutorSignUpData, password: userInput });  
        if (startedTypingConfirm) {
            setMatch(userInput === confirm);
        }       
    }

    function handleChangeCf(event) {
        setStartedTypingConfirm(true);
        const userInput = event.target.value;
        setConfirm(userInput);
        setMatch(tutorSignUpData.password === userInput);   
    }

    function handleChangeName(event) {
        const typedName = event.target.value;
        setTutorSignUpData({ ...tutorSignUpData, name: typedName });
    }

    function handleChangeLastName(event) {
        const typedLastName = event.target.value;
        setTutorSignUpData({ ...tutorSignUpData, last_name: typedLastName });
    }

    function handleChangeEmail(event) {
        const typedEmail = event.target.value;
        setTutorSignUpData({ ...tutorSignUpData, email: typedEmail });
    }

    async function checkEmailExists(email) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/check-email?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        console.log("Email check response:", data);
        return data.exists;
    }

    async function next(e) {
        e.preventDefault();
        if (tutorSignUpData.name === "" || tutorSignUpData.last_name === "" || tutorSignUpData.email === "" || tutorSignUpData.password === "") {
            alert("Por favor, completa todos los campos.");
        }
        else if (!match) {
            alert("Las contraseñas no coinciden.");     
        }
        else{
            const exists = await checkEmailExists(tutorSignUpData.email);
            if (exists) {
                alert("Este correo ya está registrado. Por favor, usa otro.");
                return;
            }
            navigate("/tutor-signup-2");
        }
    }

    function goBack() {
        navigate(-1);
    }

    return(
        <div className="Student-sign-up-1" style={{backgroundColor:"#D6E4F0"}}>
            <h1 className="title" onClick={goBack} style={{color:"#163172"}}> <MdKeyboardArrowLeft size={50}/> StudyCircle</h1>
            <div className="Sign-up-form" style={{backgroundColor:"#163172"}}>
                <div>
                    <form className="form-container" onSubmit={next}>
                        <h1 style={{color:"#D6E4F0"}}>Regístrate</h1>
                        <div></div>

                        <label htmlFor="name" style={{color:"#D6E4F0"}}>Nombre(s)</label>
                        <input htmlFor="name" type="text" placeholder="Ingrese su(s) nombre(s)" value={tutorSignUpData.name} onChange={handleChangeName}/>

                        <label htmlFor="last-name" style={{color:"#D6E4F0"}}>Apellidos(s)</label>
                        <input htmlFor="last-name" type="last-name" placeholder="Escriba su(s) apellido(s)" value={tutorSignUpData.last_name} onChange={handleChangeLastName} />

                        <label htmlFor="email" style={{color:"#D6E4F0"}}>Correo electrónico</label>
                        <input htmlFor="email" type="text" placeholder="Escriba su correo electrónico" value={tutorSignUpData.email} onChange={handleChangeEmail} />

                        <label htmlFor="password" style={{color:"#D6E4F0"}}>Contraseña</label>
                        <div className="input-with-icon">
                            <input id="password" type={visible ? "text" : "password"} placeholder="Ingrese su contraseña" value={tutorSignUpData.password} onChange={handleChangePwd}/>
                            <button
                                type="button"
                                className="eye-toggle"
                                onClick={() => setVisible(previousValue => !previousValue)}
                                aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {(startedTypingConfirm && !match &&  <IoIosWarning title="Las contraseñas no coinciden." style={{ cursor: 'help' }} />)}
                                {visible ? <LuEyeClosed size={26}/> : <LuEye size={26}/>}
                            </button>
                        </div>

                        <label htmlFor="confirm-password" style={{color:"#D6E4F0"}}>Reingrese contraseña</label>
                        <div className="input-with-icon">
                            <input id="confirm-password" type={visible ? "text" : "password"} placeholder="Ingrese nuevamente su contraseña" value={confirm} onChange={handleChangeCf}/>
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
                    <FaChalkboardTeacher size={350} color="#D6E4F0"/>
                </div>
            </div>  
        </div>
    )
}

export default TutorSignUp1Screen;