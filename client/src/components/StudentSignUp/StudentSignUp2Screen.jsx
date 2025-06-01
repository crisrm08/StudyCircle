import React, { useEffect, useContext, useState } from "react";
import { StudentSignUpContext } from "../../contexts/StudentSignUpContext";
import Select from "react-select";
import "../../css/signUpStyles/signup.css";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";
import axios from "axios";

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

function StudentSignUp2Screen() {
  
  const navigate = useNavigate();
  const { studentSignUpData, setStudentSignUpData } = useContext(StudentSignUpContext);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [degrees, setDegrees] = useState([]);

  useEffect(() => {
    axios.get("http://10.0.0.16:5000/subjects-topics")
      .then(response => {
        setSubjects(response.data);
        const allTopics = response.data.flatMap(subj => subj.topics.map(t => ({ ...t, subject: subj.name })));
        setTopics(allTopics);
      })
      .catch(error => {
        console.error("Error fetching subjects: ", error);
      });

    axios.get("http://10.0.0.16:5000/degrees")
      .then(response => {
        const fetchedDegrees = response.data.map(degree => ({
          value: degree.id,
          label: degree.name,
        }));
        setDegrees(fetchedDegrees);
      })
      .catch(error => {
        console.error("Error fetching degrees: ", error);
      });
  }, []);   

  function signUpSuccesful() {
    navigate("/edit-stu-profile");
  } 

  function handleChangeCarrer(event) {
    const selectedOption = event.target.value;
    setStudentSignUpData({ ...studentSignUpData, career: selectedOption});
  }

  const groupedTopics = React.useMemo(() => {
    if (!subjects || subjects.length === 0) return [];
    return subjects.map(subj => ({
      label: subj.name,
      options: subj.topics.map(t => ({ value: t.id, label: t.name }))
    }));
  }, [subjects]);

  function handleChangeSubjectWeak(selectedOptions) {
    setStudentSignUpData({ ...studentSignUpData, subject_weak: selectedOptions });
  }

  function handleChangeSubjectStrong(selectedOptions) {
    setStudentSignUpData({ ...studentSignUpData, subject_strong: selectedOptions });
  }

  function handleChangeInstitution(event) {
    const institution = event.target.value;
    setStudentSignUpData({ ...studentSignUpData, institution: institution });
  }

  function handleChangeYear(event) {
    const selectedOption = event.target.value;
    setStudentSignUpData({ ...studentSignUpData, year: selectedOption });
  }

  function goBack() {
    navigate(-1);
  } 

  return (
    <div className="Student-sign-up-1">
      <h1 className="title" onClick={goBack}> <MdKeyboardArrowLeft size={50}/> StudyCircle </h1>
      <div className="Sign-up-form second-form">
        <form className="form-container" style={{width:"100%"}}>
          <h1>Regístrate</h1>
          <div></div>

          <label htmlFor="engineering-degree">¿Cuál ingeniería estudias?</label>
          <Select
            id="engineering-degree"
            name="engineering-degree"
            placeholder="Selecciona aquí..."
            options={degrees}
            value={studentSignUpData.career}
            onChange={handleChangeCarrer}
            styles={customStyles}
          />

          <label htmlFor="weaknesses">¿Qué asignaturas se te dificultan?</label>
          <Select
            id="weaknesses"
            name="weaknesses"
            placeholder="Selecciona aquí..."
            isMulti
            closeMenuOnSelect={false}
            options={groupedTopics}
            value={studentSignUpData.subject_weak}
            onChange={handleChangeSubjectWeak}
            styles={customStyles}
          />

          <label htmlFor="strengths">¿Qué asignaturas se te dan bien?</label>
          <Select
            id="strengths"
            name="strengths"
            placeholder="Selecciona aquí..."
            isMulti
            closeMenuOnSelect={false}
            options={groupedTopics}
            value={studentSignUpData.subject_strong}
            onChange={handleChangeSubjectStrong}
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
            value={studentSignUpData.year}
            onChange={handleChangeYear}
            styles={customStyles}
          />

          <button type="submit" onClick={signUpSuccesful}>Registrar</button>
        </form>
      </div>
    </div>
  );
}

export default StudentSignUp2Screen;
