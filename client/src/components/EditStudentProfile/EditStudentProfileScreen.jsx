import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import StudentSidebar from "../Common/StudentSidebar";
import { SidebarContext } from "../../contexts/SidebarContext";
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

function EditStudentProfileScreen() {
    const { user } = useUser();
    const [formData, setFormData] = useState({
        name: user?.name || "",
        last_name: user?.last_name || "",
        institution: user?.institution || "",
        full_description: user?.full_description || "",
        short_description: user?.short_description || "",
    });
    const [career, setCareer] = useState(null);
    const { userStrongTopics } = useUser();
    const { userWeakTopics } = useUser();
    const { imageData } = useUser();
    const { imageFilePath } = useUser();
    const [engineeringOptions, setEngineeringOptions] = useState([]);
    const [groupedSubjects, setGroupedSubjects] = useState([]);
    const [weakness, setWeakness] = useState([]);
    const [strength, setStrength] = useState([]);
    const [preview, setPreview] = useState();
    const [selectedFile, setSelectedFile] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const navigate = useNavigate();
    const fileInputRef = useRef();

    useEffect(() => {
        if (user) {
            setFormData({
            name: user.name || "Escribe tu nombre aquí",
            last_name: user.last_name || "Escribe tu apallido",
            institution: user.institution || "Donde estudias",
            full_description: user.full_description || "Describe tu perfil, agrega enlaces, etc...",
            short_description: user.short_description || "Una breve descripción",
            });
            setPreview(imageData);
            setSelectedFile(imageData);
        }
    }, [user]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/careers`)
            .then(res => {
                setEngineeringOptions(res.data.map(career => ({ value: career.name, label: career.name })));
            })
            .catch(err => {
                console.error("Error fetching careers:", err);
            });
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/subjects-topics`)
            .then(res => {
                setGroupedSubjects(res.data.map(subject => ({
                label: subject.name,
                options: subject.topics.map(topic => ({ value: topic.id, label: topic.name  }))})));
            })
    }, []);

    useEffect(() => {
        if (groupedSubjects.length > 0 && userStrongTopics) {
            const allOptions = groupedSubjects.flatMap(group => group.options);
            setStrength(userStrongTopics.map(topicName => allOptions.find(opt => opt.value === topicName || opt.label === topicName))
                    .filter(Boolean)
            );
        }
        if (groupedSubjects.length > 0 && userWeakTopics) {
            const allOptions = groupedSubjects.flatMap(group => group.options);
            setWeakness(
                userWeakTopics.map(topicName => allOptions.find(opt => opt.value === topicName || opt.label === topicName))
                    .filter(Boolean)
            );
        }
    }, [groupedSubjects, userStrongTopics, userWeakTopics]);

    useEffect(() => {
        if (engineeringOptions.length > 0 && user?.career) {
            const preset = engineeringOptions.find(opt => opt.value === user.career);
        if (preset) setCareer(preset);
    }
}, [engineeringOptions, user?.career]);


    function handleImageClick() {
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

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();  
        
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            form.append(key, value);
        }); 

        form.append("career", career?.value || "");
        form.append("user_id", user.user_id);
        form.append("strong_topics", JSON.stringify(strength.map(t => t.value)));
        form.append("weak_topics", JSON.stringify(weakness.map(t => t.value)));
        form.append("user_image", selectedFile);
        form.append("file_path", `user_${user.user_id}.jpg`);

        if (!formData.name || !formData.last_name || !formData.institution || !career || !strength.length || !weakness.length) {
            alert("Por favor completa todos los campos requeridos.");
            return;
        }

        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/student-save-update`,
            form,
            { headers: { "Content-Type": "multipart/form-data" } }
        ).then(() => {
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                    navigate("/student-profile");
                }, 2000);
            }
        );
    }

    return (
        <div className="edit-profile-screen">
            <Header />
            <h1 className="edit-title">Edita tu perfil</h1>
            <form className="edit-profile-container">
                <div className="left">
                    <label htmlFor="name">Nombre(s)</label>
                    <input name="name" type="text" placeholder={formData.name} value={formData.name} onChange={handleChange} />
                    <label htmlFor="last_name">Apellidos(s)</label>
                    <input name="last_name" type="text" placeholder={formData.last_name} value={formData.last_name} onChange={handleChange} />
                    <label htmlFor="institution">Institución/Universidad</label>
                    <input name="institution" type="text" placeholder={formData.institution} value={formData.institution} onChange={handleChange} />
                    <label htmlFor="engineering-degree">Ingeniería</label>
                    <Select
                        id="career"
                        name="career"
                        placeholder="Selecciona aquí tu carrera"
                        options={engineeringOptions}
                        value={career}
                        onChange={setCareer}
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
                    <label htmlFor="short_description">Descripción breve</label>
                    <input name="short_description" type="text" placeholder={formData.short_description} value={formData.short_description} onChange={handleChange} />
                </div>
                <div className="right">
                    <img src={preview} alt="profile-pic" onClick={handleImageClick} style={{ cursor: 'pointer' }} />
                    <p>Haz click para cambiar tu foto</p>
                    <input type="file" accept=".png, .jpg, .jpeg, .webp" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                    <label htmlFor="full_description">Sobre mí</label>
                    <textarea name="full_description" id="about-me" placeholder={formData.full_description} value={formData.full_description} onChange={handleChange}></textarea>
                </div>
            </form>
            <button className="save-button" onClick={handleSubmit}>Guardar</button>
            {showToast && <div className="toast">✅ Cambios guardados</div>}
            {isSidebarClicked && (
                <>
                    <div className="overlay" onClick={() => setIsSidebarClicked(false)} />
                    <StudentSidebar />
                </>
            )}
        </div>
    );
}

export default EditStudentProfileScreen;