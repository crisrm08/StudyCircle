import React, { useState, useContext } from "react";
import Select from "react-select";
import { TutorSignUpContext } from "../../contexts/TutorSignUpContext";
import "../../css/signUpStyles/signup.css";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";

const academicLevels = [
  { value: "secundaria", label: "Secundaria" },
  { value: "técnico", label: "Técnico Superior" },
  { value: "grado", label: "Grado (ingeniero)" },
  { value: "maestría", label: "Maestría" },
  { value: "phd", label: "Doctorado" }
];

const subjects = [
    { value: "Cálculo", label: "Cálculo"},
    { value: "Física", label: "Física"},
    { value: "Química", label: "Química"},
    { value: "Programación", label: "Progrmación"},
    { value: "Álgebra", label: "Álgebra"}
]

const ocupations = [
  {value: "estudiante", label: "Estudiante avanzado"},
  {value: "profesor", label: "Profesor"},
  {value: "Ingeniero", label: "Ingeniero"}
]

const groupedSubjects = [
  {
    label: "Cálculo",
    options: [
      { value: "limites", label: "Límites y continuidad" },
      { value: "derivadas", label: "Derivadas y su interpretación" },
      { value: "aplicaciones", label: "Aplicaciones de las derivadas" },
      { value: "integrales", label: "Integrales definidas e indefinidas" },
      { value: "tecnicas", label: "Técnicas de integración" },
      { value: "fundamental", label: "Teorema fundamental del cálculo" },
      { value: "series", label: "Series y secuencias" },
      { value: "diferenciales", label: "Ecuaciones diferenciales" },
      { value: "infinitos", label: "Teoría de los límites infinitos" },
      { value: "multivariable", label: "Cálculo multivariable" },
    ],
  },
  {
    label: "Programación",
    options: [
      { value: "oop", label: "Programación Orientada a Objetos (OOP)" },
      { value: "datastruct", label: "Estructuras de datos" },
      { value: "algoritmos", label: "Algoritmos y complejidad computacional" },
      { value: "bd", label: "Bases de datos" },
      { value: "web", label: "Programación web (HTML, CSS, JavaScript)" },
      { value: "movil", label: "Desarrollo móvil" },
      { value: "patrones", label: "Patrones de diseño de software" },
      { value: "lenguajes", label: "Lenguajes (Python, Java, C++)" },
      { value: "so", label: "Sistemas operativos y gestión de memoria" },
      { value: "testing", label: "Pruebas y depuración de código" },
    ],
  },
];

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#F6F6F6",
    borderColor: state.isFocused ? "#1E56A0" : "#D6E4F0",
    boxShadow: "none",
    "&:hover": { borderColor: "#1E56A0" },
    borderRadius: 25,
    minHeight: 40,
    width: "100%",
  }),
  menu: provided => ({
    ...provided,
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
    marginTop: 4,
  }),
  option: (provided, { isFocused, isSelected }) => ({
    ...provided,
    backgroundColor: isSelected
      ? "#1E56A0"
      : isFocused
      ? "#D6E4F0"
      : "transparent",
    color: isSelected ? "#FFFFFF" : "#163172",
    cursor: "pointer",
  }),
  singleValue: provided => ({ ...provided, color: "#163172" }),
  placeholder: provided => ({ ...provided, color: "#58769c" }),
};

function TutorSignUp2Screen() {
    const [academicLevel, setAcademicLevel] = useState(null);
    const [tutorOcupation, setTutorOcupation] = useState(null);
    const [strength, setStrength] = useState([]);
    const { tutorSignUpData, setTutorSignUpData } = useContext(TutorSignUpContext);
    const navigate = useNavigate();

    async function next(event) {
      event.preventDefault();
      if (
        tutorSignUpData.academic_level === "" ||
        tutorSignUpData.institution === "" ||
        tutorSignUpData.subject_teach.length === 0 ||
        tutorSignUpData.password === "" ||
        tutorSignUpData.hourly_fee === ""
      ) {
        alert("Por favor, completa todos los campos");
        return;
      }
      navigate("/tutor-sign-up-3");
    }

    function handleChangeAcademicLevel(selectedOption) {
      setTutorSignUpData({ ...tutorSignUpData, academic_level: selectedOption.value});
    }

    function handleChangeInstitution(selectedOption) {
      setTutorSignUpData({ ...tutorSignUpData, institution: selectedOption.target.value });
    }

    function handleChangeOcupation(selectedOption) {
      setTutorSignUpData({ ...tutorSignUpData, occupation: selectedOption.map(item => item.value) });
    }

    function  handleChangeSubjectTeaches(selectedOption) {
      setTutorSignUpData({ ...tutorSignUpData, subject_teach: selectedOption.map(item => item.value) });   
    }

    function goBack() {
        navigate(-1);
    }
    
    return (
        <div className="Student-sign-up-1" style={{backgroundColor:"#D6E4F0"}}>
            <h1 className="title" onClick={goBack} style={{color:"#163172"}}> <MdKeyboardArrowLeft size={50}/> StudyCircle</h1>
            <div className="Sign-up-form second-form" style={{backgroundColor:"#163172"}}>
                <form className="form-container" style={{width:"100%"}}>
                    <h1 style={{color:"#D6E4F0"}}>Regístrate</h1>
                    <div></div>

                    <label htmlFor="academic-level" style={{color:"#D6E4F0"}}>Nivel académico</label>
                    <Select
                        id="academic-level"
                        name="academic-level"
                        placeholder="Selecciona aquí..."
                        options={academicLevels}
                        value={academicLevel}
                        onChange={setAcademicLevel}
                        styles={customStyles}
                    />

                    <label htmlFor="institution" style={{color:"#D6E4F0"}}>Institución donde trabaja o estudia</label>
                    <input id="institution" type="text" placeholder="Escribe el nombre aquí" style={{maxWidth: "-webkit-fill-available"}}/>

                    <label htmlFor="ocupations" style={{color:"#D6E4F0"}}>Selecciona tu ocupación principal</label>
                    <Select
                        id="ocupations"
                        name="ocupations"
                        placeholder="Selecciona aquí..."
                        closeMenuOnSelect={false}
                        options={ocupations}
                        value={tutorOcupation}
                        onChange={setTutorOcupation}
                        styles={customStyles}
                    />

                    <label htmlFor="strengths" style={{color:"#D6E4F0"}}>Temas a enseñar</label>
                    <Select
                        id="strengths"
                        name="strengths"
                        placeholder="Selecciona aquí..."
                        isMulti
                        closeMenuOnSelect={false}
                        options={groupedSubjects}
                        value={strength}
                        onChange={setStrength}
                        styles={customStyles}
                    />

                    <label htmlFor="price-per-hour" style={{color:"#D6E4F0"}}>Tarifa por hora</label>
                    <input id="price-per-hour" type="number" placeholder="Ingrese su precio en DOP" style={{maxWidth: "-webkit-fill-available"}}/>
                                    
                    <button type="submit" className="next" onClick={next}>Registrar</button>
                </form>
        </div>
        </div>
    );
}

export default TutorSignUp2Screen;
