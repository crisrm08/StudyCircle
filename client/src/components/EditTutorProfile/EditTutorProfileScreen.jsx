import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ScheduleSelector from "./ScheduleSelector";
import { SidebarContext } from "../../contexts/SidebarContext";
import TutorSidebar from "../Common/TutorSidebar";
import Header from "../Common/Header";
import Select from "react-select";
import "../../css/editProfileStyles/editprofilescreen.css";

const ocupations = [
  {value: "estudiante", label: "Estudiante avanzado"},
  {value: "profesor", label: "Profesor"},
  {value: "Ingeniero", label: "Ingeniero"}
]

const academicLevels = [
  { value: "secundaria", label: "Secundaria" },
  { value: "técnico", label: "Técnico Superior" },
  { value: "grado", label: "Grado (ingeniero)" },
  { value: "maestría", label: "Maestría" },
  { value: "phd", label: "Doctorado (PhD)" }
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
    borderRadius: 25,
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

function EditTutorProfileScreen() {
    const [ currentName ] = useState("Carlos");
    const [ currentLastName ] = useState("Santana");
    const [ currentOcupation, setCurrentOcupation ] = useState("Profesor")
    const [ currentInstitution ] = useState("INTEC");
    const [ currentAcademicLevel, setCurrentAcademicLevel ] = useState("Maestría");
    const [ currentPricePerHour ] = useState("1000");
    const [schedule, setSchedule] = useState({
        Lunes: { from: "16:00", to: "18:00" },
        Miércoles: { from: "19:00", to: "22:00" }
    });
    const [ currentFullDescription ] = useState("Docente egresado de la Universidad Autónoma de Santo Domingo de la carrera de Física. Cuento con más de 10 años de experiencia dedicados a la docencia de estudiantes universitarios en el Insituto Tecnológico de Santo Domingo.");
    const [ currentBriefDescription ] = useState("Apasionado por la enseñanza de matemáticas y física. Vamos a resolver tus dudas juntos.");
    const teachedTopicsInitialValues = [
      { value: "cinemática y movimiento", label: "Cinemática y movimiento" },
      { value: "pndas y sonido",    label: "Ondas y Sonido" },
      { value: "física nuclear", label: "Física Nuclear" }
    ];
    const [teachedTopics, setTeachedTopics] = useState(teachedTopicsInitialValues);
    const currentImageUrl = "https://randomuser.me/api/portraits/men/32.jpg";
    const [preview, setPreview] = useState(currentImageUrl);
    const [ showToast, setShowToast ] = useState(false);
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);

    const navigate = useNavigate();
    const fileInputRef = useRef();

    function handleImageClick(){
      fileInputRef.current.click();
    };

    function handleFileChange (event) {
      const file = event.target.files[0];
      if (file) {
        
        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
      }
    }

    function handleSubmit(event) {
      event.preventDefault();
      setShowToast(true);

      setTimeout(() => {
        navigate("/tutor-info");
      }, 2000);
    }
  

    return(
        <div className="edit-profile-screen">
            <Header/>
            <h1 className="edit-title">Edita tu perfil</h1>
            <form className="edit-profile-container">
                <div className="left" style={{gridRowGap: 0}}>

                  <label htmlFor="ocupation">Ocupación</label>
                    <Select
                        id="ocupation"
                        name="ocupation"
                        placeholder={currentOcupation}
                        options={ocupations}
                        value={currentOcupation}
                        onChange={setCurrentOcupation}
                        styles={customStyles}
                    />

                    <label htmlFor="Institution">Institución/Universidad</label>
                    <input htmlFor="Institution" type="text" placeholder={currentInstitution} />

                    <label htmlFor="academic-level">Nivel académico</label>
                    <Select
                        id="academic-level"
                        name="academic-level"
                        placeholder={currentAcademicLevel}
                        options={academicLevels}
                        value={currentAcademicLevel}
                        onChange={setCurrentAcademicLevel}
                        styles={customStyles}
                    />

                    <label htmlFor="teached-topics">Temas impartidos</label>
                    <Select
                        id="teached-topics"
                        name="teached-topics"
                        placeholder="Selecciona aquí..."
                        isMulti
                        closeMenuOnSelect={false}
                        options={groupedSubjects}
                        value={teachedTopics}
                        onChange={setTeachedTopics}
                        styles={customStyles}
                    />

                    <label htmlFor="availability">Disponibilidad horaria</label>
                    <ScheduleSelector schedule={schedule} setSchedule={setSchedule} />
                </div>

                <div className="right">
                    
                  <div className="top-right">
                    <div className="name-lastname">
                      <label htmlFor="name">Nombre(s)</label>
                      <input htmlFor="name" type="text" placeholder={currentName} />

                      <label htmlFor="last-name">Apellidos(s)</label>
                      <input htmlFor="last-name" type="text" placeholder={currentLastName} />
                    </div>
                    <div className="top-right-image">
                      <img src={preview}  alt="profile-pic" onClick={handleImageClick} style={{ cursor: 'pointer' }}/>
                      <p>Haz click para cambiar tu foto</p>
                    </div>
                  </div>

                    <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange}/>

                    <label htmlFor="brief-description">Descripción breve</label>
                    <input htmlFor="brief-description" className="brief-description" type="text" value={currentBriefDescription} />

                    <label htmlFor="about-me">Sobre mí</label>
                    <textarea name="about-me" id="about-me" value={currentFullDescription}></textarea>
                </div>
            </form>

            <button className="save-button" style={{marginTop: 0}} onClick={handleSubmit}>Guardar</button>
            {showToast && <div className="toast">✅ Cambios guardados</div>}
            {isSidebarClicked && (
                <>
                    <div className="overlay" onClick={() => setIsSidebarClicked(false)}/>
                    <TutorSidebar />
                </>
            )}
        </div>
    )
}

export default EditTutorProfileScreen;