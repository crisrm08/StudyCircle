import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../Common/StudentSidebar";
import { SidebarContext } from "../../contexts/SidebarContext";
import Header from "../Common/Header";
import Select from "react-select";
import "../../css/editProfileStyles/editprofilescreen.css";

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

function EditStudentProfileScreen() {
    const [ currentName ] = useState("Elvis");
    const [ currentLastName ] = useState("García");
    const [currentInstitution ] = useState("INTEC");

    const strengthInitialValues = [
      { value: "Leyes de Newton", label: "Leyes de Newton" },
      { value: "Base de Datos",    label: "Base de Datos" },
      { value: "Técnicas de Integración", label: "Técnicas de Integración" }
    ];
    const weaknessInitialValues = [
      { value: "Ecuaciones diferenciales", label: "Ecuaciones diferenciales" },
      { value: "Pruebas y depuración de código", label: "Pruebas y depuración de código" }
    ]
    const [ fullDescription ] = useState("Estudiante de primer año de la carrera de Ingeniería en Ciencias de la Computación en la Pontificia Universidad Católica Madre y Maestra. Me interesa mejorar mis habilidades en la asignatura de Ecuaciones Diferenciales, ya que no me fue muy bien en mi primer parcial y necesito reforzar.");
    const [ briefDescription ] = useState("Estudiante de primer año de la carrera de Ingeniería en Ciencias de la Computación");
    const [degree, setDegree] = useState("Ingeniería en ciencias de la computación");
    const [weakness, setWeakness] = useState(weaknessInitialValues);
    const [strength, setStrength] = useState(strengthInitialValues);
    const currentImageUrl = "https://randomuser.me/api/portraits/men/12.jpg";
    const [preview, setPreview] = useState(currentImageUrl);
    const [ showToast, setShowToast ] = useState(false);
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);

    const navigate = useNavigate();
    const fileInputRef = useRef();

    const handleImageClick = () => {
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
        navigate("/student-profile");
      }, 2000);
    }
  

    return(
        <div className="edit-profile-screen">
            <Header/>
            <h1 className="edit-title">Edita tu perfil</h1>
            <form className="edit-profile-container">
                <div className="left">

                    <label htmlFor="name">Nombre(s)</label>
                    <input htmlFor="name" type="text" placeholder={currentName} />

                    <label htmlFor="last-name">Apellidos(s)</label>
                    <input htmlFor="last-name" type="text" placeholder={currentLastName} />

                    <label htmlFor="Institution">Institución/Universidad</label>
                    <input htmlFor="Institution" type="text" placeholder={currentInstitution} />

                    <label htmlFor="engineering-degree">Ingeniería</label>
                    <Select
                        id="engineering-degree"
                        name="engineering-degree"
                        placeholder="Ingeniería en Ciencias de la Computación"
                        options={engineeringOptions}
                        value={degree}
                        onChange={setDegree}
                        styles={customStyles}
                    />

                    <label htmlFor="strengths">Destrezas</label>
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

                    <label htmlFor="weaknesses">Debilidades</label>
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

                    <label htmlFor="brief-description">Descripción breve</label>
                    <input htmlFor="brief-description" type="text" value={briefDescription} />
                </div>

                <div className="right">
                    <img src={preview}  alt="profile-pic" onClick={handleImageClick} style={{ cursor: 'pointer' }}/>
                    <p>Haz click para cambiar tu foto</p>
                    <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange}/>

                    <label htmlFor="about-me">Sobre mí</label>
                    <textarea name="about-me" id="about-me" value={fullDescription}></textarea>
                </div>
            </form>

            <button className="save-button" onClick={handleSubmit}>Guardar</button>
            {showToast && <div className="toast">✅ Cambios guardados</div>}
            {isSidebarClicked && (
                <>
                    <div className="overlay" onClick={() => setIsSidebarClicked(false)}/>
                    <StudentSidebar />
                </>
            )}
        </div>
    )
}

export default EditStudentProfileScreen;