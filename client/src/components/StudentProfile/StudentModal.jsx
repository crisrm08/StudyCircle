import React, {useEffect, useState}from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import "../../css/studentProfileStyles/modal.css";

function StudentModal() {
  
  const navigate = useNavigate();
  const { user } = useUser();
  const { imageData } = useUser();
  const { userStrongTopics } = useUser();
  const { userWeakTopics } = useUser();
  const [student, setStudent] = useState({
    id: null,
    image: null,
    name: "",
    last_name: "",
    degree: "",
    institution: "",
    strengths: [],
    weaknesses: [],
    rating: 0,          
    description: ""
  });
  const [reportsCount, setReportsCount] = useState(0);

  useEffect(() => {
    if (user){
      setStudent({
        id: user.user_id,
        image: imageData,
        name: user.name,
        last_name: user.last_name,
        degree: user.career,
        institution: user.institution,
        strengths: userStrongTopics,
        weaknesses: userWeakTopics,
        rating: user.rating_avg, 
        description: user.short_description,
        reports: user.report_count
      });
      setReportsCount(student.reports);
    }
  }, [user, imageData, userStrongTopics, userWeakTopics]);

  function goToEdit() {
    navigate("/edit-student-profile");
  }

  function renderStars(){
    const filledStars = Math.floor(student.rating);
    const hasHalfStar = student.rating - filledStars >= 0.5;
    const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);
    const stars = [];

    for (let i = 0; i < filledStars; i++) {
      stars.push(<span key={`filled-${i}`} className="star">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star">☆</span>);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  if(!user) return null;

  return (
    <div className="modal-content">
       <div
        className={`reports-indicator ${reportsCount > 0 ? "danger" : "safe"}`}
        title={
          reportsCount === 0
            ? "Nunca has sido reportado por un tutor"
            : `Has sido reportado ${reportsCount} ${reportsCount === 1 ? "vez" : "veces"}`
        }
      >
        {reportsCount === 0 ? "✔️" : "⚠️"} {reportsCount} reportes
      </div>

      <img src={student.image} alt={`Foto de ${student.name}`} className="modal-image"
    />

      {user.profile_type === "student" && <MdEdit className="edit-icon" size={30} onClick={goToEdit}/>}
      
      <h2 className="modal-name">{student.name} {student.last_name}</h2>
      <p className="modal-occupation">{student.institution} - {student.degree}</p>

      <h2 className="modal-strengths-title" >Destrezas</h2>
      {student.strengths?.length > 0 && (
        <div className="modal-specialties">
          {student.strengths.map((topic, index) => (
            <span key={index} className="specialty-pill">{topic}</span>
          ))}
        </div>
      )}

      <h2 className="modal-weaknesses-title" >Debilidades</h2>
      {student.weaknesses?.length > 0 && (
        <div className="modal-specialties">
          {student.weaknesses.map((topic, index) => (
            <span key={index} className="weakness-pill">{topic}</span>
          ))}
        </div>
      )}

      <div className="modal-rating"> {renderStars()} <span className="rating-number">({student.rating.toFixed(1)})</span> </div>
      <p style={{marginBottom:'0px'}} className="modal-description">{student.description}</p>
    </div>
  )
}

export default StudentModal;
