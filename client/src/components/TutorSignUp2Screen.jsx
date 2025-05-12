import React, { useState } from "react";
import Select from "react-select";

import "../css/signup.css";
import { useNavigate } from "react-router-dom";

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
    const [subjectsTeached, setSubjectsTeached] = useState(null);
    const [strength, setStrength] = useState([]);
    const navigate = useNavigate();

    function signUpSuccesful() {
        navigate("/tutor-home-page")
    }
    

    return (
        <div className="Student-sign-up-1" style={{backgroundColor:"#D6E4F0"}}>
            <h1 className="title" style={{color:"#163172"}}>StudyCircle</h1>
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

                    <label htmlFor="institution" style={{color:"#D6E4F0"}}>Universidad donde estudia o estudió</label>
                    <input id="institution" type="text" placeholder="Escribe el nombre aquí" style={{maxWidth: "-webkit-fill-available"}}/>

                    <label htmlFor="subjects-teached" style={{color:"#D6E4F0"}}>Asignaturas a enseñar</label>
                    <Select
                        id="subjects-teached"
                        name="subjects-teached"
                        placeholder="Selecciona aquí..."
                        isMulti
                        closeMenuOnSelect={false}
                        options={subjects}
                        value={subjectsTeached}
                        onChange={setSubjectsTeached}
                        styles={customStyles}
                    />

                    <label htmlFor="strengths" style={{color:"#D6E4F0"}}>¿Qué asignaturas se te dan bien?</label>
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
                                    
                    <button type="submit" className="next" onClick={signUpSuccesful}>Registrar</button>
                </form>
        </div>
        </div>
    );
}

export default TutorSignUp2Screen;
