import React, { useEffect, useContext, useState } from "react";
import { supabase } from "../Supabase/supabaseClient";
import { StudentSignUpContext } from "../../contexts/StudentSignUpContext";
import Select from "react-select";
import "../../css/signUpStyles/signup.css";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";
import axios from "axios";


const enrrollingYears = [
  { value: 2025, label: "2025" },
  { value: 2024, label: "2024" },
  { value: 2023, label: "2023" },
  { value: 2022, label: "2022" },
  { value: 2021, label: "2021" },
  { value: 2020, label: "2020" },
  { value: 2019, label: "2019" },
  { value: 2018, label: "2018" },
  { value: 2017, label: "2017" },
  { value: 2016, label: "2016" },
  { value: 2015, label: "2015" },
  { value: 2014, label: "2014" },
  { value: 2013, label: "2013" },
  { value: 2012, label: "2012" },
  { value: 2011, label: "2011" },
  { value: 2010, label: "2010" }
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
  const [careers, setCareers] = useState([]);

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

    axios.get("http://10.0.0.16:5000/careers")
      .then(response => {
        const fetchedCareers = response.data.map(career => ({
          value: career.id,
          label: career.name,
        }));
        setCareers(fetchedCareers);
      })
      .catch(error => {
        console.error("Error fetching careers: ", error);
    });
  }, []);   

  async function signUpSuccesful(event) {
    event.preventDefault();

    const { email, password, ...profileData } = studentSignUpData;
    const { data, error } = await supabase.auth.signUp({ email, password});

    if (error) {
      alert("Error al registrar usuario: " + error.message);
      return;
    }

    const supabase_user_id = data.user.id;
    axios.post("http://10.0.0.16:5000/student-signup", { ...profileData, email,supabase_user_id,})
      .then(response => {
        console.log("Signup response:", response.data);
        navigate("/edit-stu-profile");
      })
      .catch(error => {
        console.error("Error during signup:", error);
      });
  }

  const selectCareerObject = careers.find(
    (c) => c.label === studentSignUpData.career
  ) || null;

  function handleChangeCarrer(selectedOption) {
    setStudentSignUpData({ ...studentSignUpData, career: selectedOption.label });
    console.log("Selected career:", selectedOption.label);
    
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

  function handleChangeYear(selectedOption) {
    setStudentSignUpData({ ...studentSignUpData, year: selectedOption.value});
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
            placeholder="Selecciona o escribe aquí..."
            options={careers}
            value={selectCareerObject}
            isSearchable={true}
            onChange={handleChangeCarrer}
            styles={customStyles}
          />

          <label htmlFor="weaknesses">¿Qué asignaturas se te dificultan?</label>
          <Select
            id="weaknesses"
            name="weaknesses"
            placeholder="Selecciona o escribe aquí..."
            isMulti
            isSearchable={true}
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
            placeholder="Selecciona o escribe aquí..."
            isMulti
            isSearchable={true}
            closeMenuOnSelect={false}
            options={groupedTopics}
            value={studentSignUpData.subject_strong}
            onChange={handleChangeSubjectStrong}
            styles={customStyles}
          />

          <label htmlFor="institution" >Universidad o Institución</label>
          <input id="institution" type="text" placeholder="Escribe el nombre aquí" onChange={handleChangeInstitution} style={{maxWidth: "-webkit-fill-available"}}/>

          <label htmlFor="enrolling-year">Año de ingreso</label>
          <Select
            id="enrolling-year"
            name="enrolling-year"
            placeholder="Selecciona o escribe aquí..."
            options={enrrollingYears}
            value={enrrollingYears.find(year => year.value === studentSignUpData.year) || null}
            onChange={handleChangeYear}
            isSearchable={true}
            styles={customStyles}
          />

          <button type="submit" onClick={signUpSuccesful}>Registrar</button>
        </form>
      </div>
    </div>
  );
}

export default StudentSignUp2Screen;
