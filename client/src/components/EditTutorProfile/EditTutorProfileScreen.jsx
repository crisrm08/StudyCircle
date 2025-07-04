import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ScheduleSelector from "./ScheduleSelector";
import { SidebarContext } from "../../contexts/SidebarContext";
import TutorSidebar from "../Common/TutorSidebar";
import Header from "../Common/Header";
import Select from "react-select";
import axios from "axios";
import "../../css/editProfileStyles/editprofilescreen.css";

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
    const [groupedSubjects, setGroupedSubjects] = useState([]);
    const [ currentFullDescription ] = useState("Docente egresado de la Universidad Autónoma de Santo Domingo de la carrera de Física. Cuento con más de 10 años de experiencia dedicados a la docencia de estudiantes universitarios en el Insituto Tecnológico de Santo Domingo.");
    const [ currentBriefDescription ] = useState("Apasionado por la enseñanza de matemáticas y física. Vamos a resolver tus dudas juntos.");
    const teachedTopicsInitialValues = [
      { value: "cinemática y movimiento", label: "Cinemática y movimiento" },
      { value: "pndas y sonido",    label: "Ondas y Sonido" },
      { value: "física nuclear", label: "Física Nuclear" }
    ];
    const [academicLevelOptions, setAcademicLevelOptions] = useState([]);
    const [occupationOptions, setOccupationOptions] = useState([]);
    const [teachedTopics, setTeachedTopics] = useState(teachedTopicsInitialValues);
    const currentImageUrl = "https://randomuser.me/api/portraits/men/32.jpg";
    const [preview, setPreview] = useState(currentImageUrl);
    const [ showToast, setShowToast ] = useState(false);
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);

    const navigate = useNavigate();
    const fileInputRef = useRef();

     useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/subjects-topics`)
            .then(res => {
                setGroupedSubjects(res.data.map(subject => ({
                    label: subject.name,
                    options: subject.topics.map(topic => ({ value: topic.name, label: topic.name }))
                })));
            })
            .catch(err => {
                console.error("Error fetching subjects/topics:", err);
            });
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/ocupations-academic-levels`)
            .then(({data}) => {
              setOccupationOptions(
                (data.ocupations || []).map(ocupation => ({value: ocupation.value, label: ocupation.label.trim() }))
              );
              setAcademicLevelOptions(
                (data.academicLevels || []).map(academiclvl => ({value: academiclvl.value, label: academiclvl.label }))
              );
            })
            .catch(console.error);
    }, []);

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
                        options={occupationOptions}
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
                        options={academicLevelOptions}
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

                    <label htmlFor="preferred-mode">Modalidad preferida</label>
                    <div className="mode-selection">
                      <input type="radio" id="face-to-face" name="face-to-face" value="face-to-face"/>
                      <label htmlFor="face-to-face">Presencial</label>

                      <input type="radio" id="online" name="online" value="online"/>
                      <label htmlFor="online">Virtual</label>

                      <input type="radio" id="hybrid" name="hybrid" value="hybrid" defaultChecked/>
                      <label htmlFor="hybrid">Híbrido</label>
                    </div>
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