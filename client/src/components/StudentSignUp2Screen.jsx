import React, { useState } from "react";
import Select from "react-select";
import "../css/studentsignup.css";
import { PiStudentFill } from "react-icons/pi";

const engineeringOptions = [
  { value: "industrial", label: "Ingeniería industrial" },
  { value: "electrica", label: "Ingeniería Eléctrica" },
  { value: "mecanica", label: "Ingeniería Mecánica" },
  { value: "civil", label: "Ingeniería Civil" },
  { value: "telematica", label: "Ingeniería Telemática" },
  { value: "informatica", label: "Ingeniería en Ciencias de la Computación" },
  { value: "quimica", label: "Ingeniería Química" },
  { value: "mecatronica", label: "Ingeniería Mecatrónica" },
];

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

const enrrollingYears = [
  { value: "2010", label: "2010"},
  { value: "2011", label: "2011"},
  { value: "2012", label: "2012"},
  { value: "2013", label: "2013"},
  { value: "2014", label: "2014"},
  { value: "2015", label: "2015"},
  { value: "2016", label: "2016"},
  { value: "2017", label: "2017"},
  { value: "2018", label: "2018"},
  { value: "2019", label: "2019"},
  { value: "2020", label: "2020"},
  { value: "2021", label: "2021"},
  { value: "2022", label: "2022"},
  { value: "2023", label: "2013"},
  { value: "2024", label: "2024"},
  { value: "2025", label: "2025"},
];

// customStyles para adaptar react-select a tu paleta
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#F6F6F6",
    borderColor: state.isFocused ? "#1E56A0" : "#D6E4F0",
    boxShadow: "none",
    "&:hover": { borderColor: "#1E56A0" },
    borderRadius: 8,
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

function StudentSignUp2Screen() {
  const [degree, setDegree] = useState(null);
  const [weakness, setWeakness] = useState([]);
  const [strength, setStrength] = useState([]);

  return (
    <div className="Student-sign-up-1">
      <h1 className="title">StudyCircle</h1>
      <div className="Sign-up-form second-form">
        <form className="form-container" style={{width:"100%"}}>
          <h1>Regístrate</h1>
          <div></div>

          <label htmlFor="engineering-degree">¿Cuál ingeniería estudias?</label>
          <Select
            id="engineering-degree"
            name="engineering-degree"
            placeholder="Selecciona aquí..."
            options={engineeringOptions}
            value={degree}
            onChange={setDegree}
            styles={customStyles}
            
          />

          <label htmlFor="weaknesses">¿Qué asignaturas se te dificultan?</label>
          <Select
            id="weaknesses"
            name="weaknesses"
            placeholder="Selecciona aquí..."
            isMulti
            closeMenuOnSelect={false}
            options={groupedSubjects}
            value={weakness}
            onChange={setWeakness}
            styles={customStyles}
          />

          <label htmlFor="institution" >Universidad o Institución</label>
          <input id="institution" type="text" placeholder="Escribe el nombre aquí" style={{maxWidth: "-webkit-fill-available"}}/>

          <label htmlFor="enrolling-year">Año de ingreso</label>
          <Select
            id="enrolling-year"
            name="enrolling-year"
            placeholder="Selecciona aquí..."
            options={enrrollingYears}
            value={degree}
            onChange={setDegree}
            styles={customStyles}
          />

          <label htmlFor="strengths">¿Qué asignaturas se te dan bien?</label>
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

          <button type="submit">Siguiente</button>
        </form>
      </div>
    </div>
  );
}

export default StudentSignUp2Screen;
