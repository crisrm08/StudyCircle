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
    const PLACEHOLDERS = {
      name: "Escribe tu nombre aquí",
      last_name: "Escribe tu apellido",
      institution: "Donde trabajas/estudias",
      short_description: "Una breve descripción",
      full_description: "Describe tu perfil, agrega enlaces...",
      hourly_fee: "Tu precio por hora de tutoría",
      academic_level: "Selecciona tu nivel académico más alto",
      occupation: "Selecciona tu ocupación principal"
    };
    const [formData, setFormData] = useState({
      name: "",
      last_name: "",
      institution: "",
      short_description: "",
      full_description: "",
      hourly_fee: ""
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
    const [academicLevelOptions, setAcademicLevelOptions] = useState([]);
    const [occupationOptions, setOccupationOptions] = useState([]);
    const [teachedTopics, setTeachedTopics] = useState();
    const [preview, setPreview] = useState();
    const [ showToast, setShowToast ] = useState(false);
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const navigate = useNavigate();
    const fileInputRef = useRef();

    useEffect(() => {
      if (!user) return;
      setFormData({
        name: user.name || "",
        last_name: user.last_name || "",
        institution: user.institution || "",
        short_description: user.short_description || "",
        full_description: user.full_description || "",
        hourly_fee: user.hourly_fee   || ""
      });
      setPreview(imageData);
      setSelectedFile(imageData);
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
    }, [groupedSubjects, userTeachedTopics, user]);

    const daysOfWeek = [
      "Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"
    ];

    useEffect(() => {
      if (!user) return;
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/tutor-availability`, { params: { tutor_id: user.user_id }})
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

        if (!formData.name || !formData.last_name || !formData.institution || !currentOcupation || !currentAcademicLevel || !teachedTopics.length) {
            alert("Por favor completa todos los campos requeridos.");
            return;
        }

        await axios.post("http://localhost:5000/tutor-save-update",
            form,
            { headers: { "Content-Type": "multipart/form-data" } }
        ).then(() => {
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                    navigate("/tutor-profile");
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
                        placeholder={PLACEHOLDERS.occupation}
                        options={occupationOptions}
                        value={currentOcupation}
                        onChange={handleOcupationChange}
                        styles={customStyles}
                    />

                    <label htmlFor="institution">Institución/Universidad</label>
                    <input id="institution" name="institution" type="text" placeholder={PLACEHOLDERS.institution} value={formData.institution} onChange={handleChange} />

                    <label htmlFor="academic-level">Nivel académico</label>
                    <Select
                        id="academic-level"
                        name="academic_level_id"
                        placeholder={PLACEHOLDERS.academic_level}
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

                    <label htmlFor="hourly_fee">Precio por hora</label>
                    <input id="hourly_fee"  name="hourly_fee" type="text" placeholder={PLACEHOLDERS.hourly_fee} value={formData.hourly_fee} onChange={handleChange} />
                </div>

                <div className="right">
                    
                  <div className="top-right">
                    <div className="name-lastname">
                      <label htmlFor="name">Nombre(s)</label>
                      <input id="name" name="name" type="text" placeholder={PLACEHOLDERS.name} value={formData.name} onChange={handleChange}/>

                      <label htmlFor="last_name">Apellidos(s)</label>
                      <input id="name" name="last_name" type="text" placeholder={PLACEHOLDERS.last_name} value={formData.last_name} onChange={handleChange} />
                    </div>
                    <div className="top-right-image">
                      <img src={preview}  alt="profile-pic" onClick={handleImageClick} style={{ cursor: 'pointer' }}/>
                      <p>Haz click para cambiar tu foto</p>
                    </div>
                  </div>

                    <input type="file" accept=".png, .jpg, .jpeg, .webp" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange}/>

                    <label htmlFor="short_description">Descripción breve</label>
                    <input id="short_description" name="short_description" className="brief-description" type="text" placeholder={PLACEHOLDERS.short_description} value={formData.short_description} onChange={handleChange} />

                    <label htmlFor="full_description">Sobre mí</label>
                    <textarea id="full_description" name="full_description" placeholder={PLACEHOLDERS.full_description} value={formData.full_description} onChange={handleChange}></textarea>
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