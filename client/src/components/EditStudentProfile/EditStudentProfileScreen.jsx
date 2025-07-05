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
    const { user, setUser } = useUser();
    const { userStrongTopics } = useUser();
    const { userWeakTopics } = useUser();
    const [engineeringOptions, setEngineeringOptions] = useState([]);
    const [groupedSubjects, setGroupedSubjects] = useState([]);
    const [career, setCareer] = useState(user?.career || "");
    const [weakness, setWeakness] = useState([]);
    const [strength, setStrength] = useState([]);
    const [currentName] = useState(user?.name || "");
    const [currentLastName] = useState(user?.last_name || "");
    const [currentInstitution] = useState(user?.institution || "");
    const [fullDescription] = useState(user?.full_description || "");
    const [briefDescription] = useState(user?.short_description || "");
    const currentImageUrl = "https://randomuser.me/api/portraits/men/12.jpg";
    const [preview, setPreview] = useState(currentImageUrl);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const navigate = useNavigate();
    const fileInputRef = useRef();

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
                    options: subject.topics.map(topic => ({ value: topic.name, label: topic.name }))
                })));
            })
            .catch(err => {
   
            });
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

    function handleImageClick() {
        fileInputRef.current.click();
    };

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
            setSelectedFile(file); 
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        axios.post("http")
        setShowToast(true);
        setTimeout(() => {
            navigate("/student-profile");
        }, 2000);
    }

    return (
        <div className="edit-profile-screen">
            <Header />
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
                        placeholder={career}
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
                    <label htmlFor="brief-description">Descripción breve</label>
                    <input htmlFor="brief-description" type="text" value={briefDescription} />
                </div>
                <div className="right">
                    <img src={preview} alt="profile-pic" onClick={handleImageClick} style={{ cursor: 'pointer' }} />
                    <p>Haz click para cambiar tu foto</p>
                    <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                    <label htmlFor="about-me">Sobre mí</label>
                    <textarea name="about-me" id="about-me" value={fullDescription}></textarea>
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