import React, { useState, useContext, useEffect } from "react";
import Select from "react-select";
import { TutorSignUpContext } from "../../contexts/TutorSignUpContext";
import "../../css/signUpStyles/signup.css";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";
import axios from "axios";

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


function TutorSignUp2Screen() {
    const [academicLevelOptions, setAcademicLevelOptions] = useState([]);
    const [occupationOptions, setOccupationOptions] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const { tutorSignUpData, setTutorSignUpData } = useContext(TutorSignUpContext);
    const navigate = useNavigate();

    useEffect(() => {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/ocupations-academic-levels`)
        .then(({ data }) => {
          setOccupationOptions(
            (data.ocupations || []).map(ocupation => ({ value: ocupation.value, label: ocupation.label.trim() }))
          );
          setAcademicLevelOptions(
            (data.academicLevels || []).map(academiclvl => ({ value: academiclvl.value, label: academiclvl.label }))
          );
        })
        .catch(console.error);

      axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/subjects-topics`)
        .then(response => {
          setSubjects(response.data);
          const allTopics = response.data.flatMap(subj => subj.topics.map(t => ({ ...t, subject: subj.name })));
          setTopics(allTopics);
        })
        .catch(error => {
          console.error("Error fetching subjects: ", error);
        });
    }, []);

    async function next(event) {
      event.preventDefault();
      if (
        tutorSignUpData.academic_level === "" ||
        tutorSignUpData.institution === "" ||
        tutorSignUpData.occupation === "" ||
        tutorSignUpData.subject_teach.length === 0 ||
        tutorSignUpData.hourly_fee === ""
      ) {
        alert("Por favor, completa todos los campos");
        return;
      }
      navigate("/tutor-signup-3");
    }

    function handleChangeAcademicLevel(selectedOption) {
      setTutorSignUpData({ ...tutorSignUpData, academic_level: selectedOption.value })
    }
    function handleChangeOccupation(selectedOption) {
      setTutorSignUpData({ ...tutorSignUpData, occupation: selectedOption.value })
    }

    function handleChangeInstitution(event) {
      setTutorSignUpData({ ...tutorSignUpData, institution: event.target.value });
    }

    const groupedTopics = React.useMemo(() => {
      if (!subjects || subjects.length === 0) return [];
      return subjects.map(subj => ({
        label: subj.name,
        options: subj.topics.map(t => ({ value: t.id, label: t.name }))
      }));
    }, [subjects]);
    
    function handleChangeSubjectTeaches(selectedOptions) {
      setTutorSignUpData({ ...tutorSignUpData, subject_teach: selectedOptions });   
    }

    function handleChangeFee(event) {
      setTutorSignUpData({ ...tutorSignUpData, hourly_fee: event.target.value})
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
                      options={academicLevelOptions}
                      value={
                        academicLevelOptions.find(
                          opt => String(opt.value) === String(tutorSignUpData.academic_level)
                        ) || null
                      }
                      onChange={handleChangeAcademicLevel}
                      styles={customStyles}
                    />

                    <label htmlFor="institution" style={{color:"#D6E4F0"}}>Institución donde trabaja o estudia</label>
                    <input id="institution" type="text" placeholder="Escribe el nombre aquí" onChange={handleChangeInstitution} style={{maxWidth: "-webkit-fill-available"}}/>

                    <label htmlFor="ocupations" style={{color:"#D6E4F0"}}>Selecciona tu ocupación principal</label>
                    <Select
                        id="ocupations"
                        name="ocupations"
                        placeholder="Selecciona aquí..."
                        options={occupationOptions}
                        value={
                          occupationOptions.find(
                            opt => String(opt.value) === String(tutorSignUpData.occupation)
                          ) || null
                        }
                        onChange={handleChangeOccupation}
                        styles={customStyles}
                      />

                    <label htmlFor="strengths" style={{color:"#D6E4F0"}}>Temas a enseñar</label>
                     <Select
                      id="strengths"
                      name="strengths"
                      placeholder="Selecciona o escribe aquí..."
                      isMulti
                      isSearchable={true}
                      closeMenuOnSelect={false}
                      options={groupedTopics}
                      value={tutorSignUpData.subject_strong}
                      onChange={handleChangeSubjectTeaches}
                      styles={customStyles}
                    />

                    <label htmlFor="price-per-hour" style={{color:"#D6E4F0"}}>Tarifa por hora</label>
                    <input id="price-per-hour" type="number" placeholder="Ingrese su precio en DOP" onChange={handleChangeFee} style={{maxWidth: "-webkit-fill-available"}}/>
                                    
                    <button type="submit" className="next" onClick={next}>Registrar</button>
                </form>
        </div>
        </div>
    );
}

export default TutorSignUp2Screen;
