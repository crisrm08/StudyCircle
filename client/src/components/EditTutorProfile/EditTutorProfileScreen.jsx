import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
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
    const { user } = useUser();
    const { userTeachedTopics } = useUser();
    const { userOcupationName } = useUser();
    const { userAcademicLevelName } = useUser();
    const [formData, setFormData] = useState({
        name: user?.name || "",
        last_name: user?.last_name || "",
        institution: user?.institution || "",
        price_per_hour: user?.hourly_fee || "",
        full_description: user?.full_description || "",
        short_description: user?.short_description || "",
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const { imageData } = useUser();
    const { imageFilePath } = useUser();
    const [currentOcupation, setCurrentOcupation] = useState(null);
    const [currentAcademicLevel, setCurrentAcademicLevel] = useState(null);
    const [schedule, setSchedule] = useState({
        Lunes: { from: "16:00", to: "18:00" },
        Miércoles: { from: "19:00", to: "22:00" }
    });
    const [groupedSubjects, setGroupedSubjects] = useState([]);
    const teachedTopicsInitialValues = [
      { value: "cinemática y movimiento", label: "Cinemática y movimiento" },
      { value: "pndas y sonido",    label: "Ondas y Sonido" },
      { value: "física nuclear", label: "Física Nuclear" }
    ];
    const [academicLevelOptions, setAcademicLevelOptions] = useState([]);
    const [occupationOptions, setOccupationOptions] = useState([]);
    const [teachedTopics, setTeachedTopics] = useState(teachedTopicsInitialValues);
    const [preview, setPreview] = useState();
    const [ showToast, setShowToast ] = useState(false);
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const navigate = useNavigate();
    const fileInputRef = useRef();

    useEffect(() => {
        if (user) {
            setFormData({
            name: user.name || "Escribe tu nombre aquí",
            last_name: user.last_name || "Escribe tu apallido",
            institution: user.institution || "Donde trabajas/estudias",
            full_description: user.full_description || "Describe tu perfil, agrega enlaces, etc...",
            short_description: user.short_description || "Una breve descripción",
            });
            setCurrentOcupation(userOcupationName || "Selecciona tu ocupación principal");
            setCurrentAcademicLevel(userAcademicLevelName || "Selecciona tu nivel académico actual");
            setPreview(imageData);
            setSelectedFile(imageData);
        }
    }, [user]);

    useEffect(() => {
      if (occupationOptions.length && userOcupationName) {
        const found = occupationOptions.find(opt => opt.label === userOcupationName);
        setCurrentOcupation(found || null);
      }
      if (academicLevelOptions.length && userAcademicLevelName) {
        const found = academicLevelOptions.find(opt => opt.label === userAcademicLevelName);
        setCurrentAcademicLevel(found || null);
      }
    }, [occupationOptions, academicLevelOptions, userOcupationName, userAcademicLevelName]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/subjects-topics`)
            .then(res => {
                setGroupedSubjects(res.data.map(subject => ({
                    label: subject.name,
                    options: subject.topics.map(topic => ({ value: topic.id, label: topic.name }))
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

    useEffect(() => {
        if (groupedSubjects.length > 0 && userTeachedTopics) {
            const allOptions = groupedSubjects.flatMap(group => group.options);
            setTeachedTopics(userTeachedTopics.map(topicName => allOptions.find(opt => opt.value === topicName || opt.label === topicName))
                    .filter(Boolean)
            );
        }
    }, [groupedSubjects, userTeachedTopics]);

    const daysOfWeek = [
      "Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"
    ];

    useEffect(() => {
      if (!user) return;
      axios.get("http://localhost:5000/tutor-availability", { params: { tutor_id: user.user_id }})
        .then(({ data }) => {

          const init = daysOfWeek.reduce((acc, d) => {
            acc[d] = null;
            return acc;
          }, {});
      
          data.availability.forEach(({ day_of_week, start_time, end_time }) => {
            init[day_of_week] = {
              from: start_time.slice(0,5),   
              to:   end_time.slice(0,5)     
            };
          });
          setSchedule(init);
        })
        .catch(console.error);
    }, [user]);


    function handleImageClick(){
      fileInputRef.current.click();
    };

    function handleFileChange (event) {
      const file = event.target.files[0];
      if (file) {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (
          fileExtension === 'heic' ||
          !allowedTypes.includes(file.type)
        ) {
          alert('Formato de imagen no soportado. Por favor selecciona un archivo PNG, JPG o WEBP.');
          event.target.value = '';
          return;
        }
        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
        setSelectedFile(file);
      }
    }

    function handleOcupationChange(option) {
      setCurrentOcupation(option);
    }

    function handleAcademicLevelChange(option) {
      setCurrentAcademicLevel(option);
    }

    function handleChange(e) {
      const { name, value } = e.target;
      setFormData(prev => ({...prev, [name]: value}))
    }

    async function handleSubmit(event) {
        event.preventDefault();    
        
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          form.append(key, value);
        })

        form.append("user_id", user.user_id);
        form.append("occupation", currentOcupation?.value);
        form.append("academic_level", currentAcademicLevel?.value);
        form.append("teached_topics", JSON.stringify(teachedTopics.map(t => t.value)));
        form.append("schedule", JSON.stringify(schedule));
        form.append("user_image", selectedFile);
        form.append("file_path", `user_${user.user_id}.jpg`);

        await axios.post("http://localhost:5000/tutor-save-update",
            form,
            { headers: { "Content-Type": "multipart/form-data" } }
        ).then(() => {
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                    navigate("/tutor-info");
                }, 2000);
            }
        );
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
                        name="ocupation_id"
                        placeholder="Elige tu ocupación aquí..."
                        options={occupationOptions}
                        value={currentOcupation}
                        onChange={handleOcupationChange}
                        styles={customStyles}
                    />

                    <label htmlFor="Institution">Institución/Universidad</label>
                    <input name="institution" type="text" placeholder={formData.institution} value={formData.institution} onChange={handleChange} />

                    <label htmlFor="academic-level">Nivel académico</label>
                    <Select
                        id="academic-level"
                        name="academic_level_id"
                        placeholder={currentAcademicLevel}
                        options={academicLevelOptions}
                        value={currentAcademicLevel}
                        onChange={handleAcademicLevelChange}
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
                      <input name="name" type="text" placeholder={formData.name} value={formData.name} onChange={handleChange}/>

                      <label htmlFor="last_name">Apellidos(s)</label>
                      <input name="last_name" type="text" placeholder={formData.last_name} value={formData.last_name} onChange={handleChange} />
                    </div>
                    <div className="top-right-image">
                      <img src={preview}  alt="profile-pic" onClick={handleImageClick} style={{ cursor: 'pointer' }}/>
                      <p>Haz click para cambiar tu foto</p>
                    </div>
                  </div>

                    <input type="file" accept=".png, .jpg, .jpeg, .webp" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange}/>

                    <label htmlFor="short_description">Descripción breve</label>
                    <input name="short_description" className="brief-description" type="text" value={formData.short_description} onChange={handleChange} />

                    <label htmlFor="full_description">Sobre mí</label>
                    <textarea name="full_description" id="about-me" value={formData.full_description} onChange={handleChange}></textarea>
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