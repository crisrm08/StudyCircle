import React, {useState}from "react";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { FaAngleLeft } from "react-icons/fa";
import "../../css/studentProfileStyles/modal.css";

function StudentModal({showAcceptButton}) {
  console.log("values" + showAcceptButton);
  
  const navigate = useNavigate();
  const [student] = useState({
        id: 1,
        image: 'https://randomuser.me/api/portraits/men/12.jpg',
        name: 'Elvis García',
        degree: "Ingeniería en Ciencias de la Computación",
        institution: 'INTEC',
        strengths: ['Leyes de Newton', 'Base de Datos', 'Tecnicas de Integración'],
        weaknesses: ['Ecuaciones diferenciales', 'Purebas y depuración de código'],
        rating: 3.5,
        description: 'Estudiante de primer año de la carrera de Ingeniería en Ciencias de la Computación'
    });

  function goToEdit() {
    navigate("/edit-stu-profile");
  }

  function openChat() {
    navigate("/chat");
  }

  function backToHome() {
    navigate("/tutor-home-page");
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

  return (
    <div className="modal-content">

      <img
        src={student.image}
        alt={`Foto de ${student.name}`}
        style={showAcceptButton
          ? { width: 100, height: 100 }
          : undefined
        }
        className="modal-image"
    />

      {showAcceptButton === false && <MdEdit className="edit-icon" size={30} onClick={goToEdit}/>}
      
      <h2 className="modal-name">{student.name}</h2>
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
      <div className="modal-button-container">
        {showAcceptButton === true && ( <button className="back-button" style={{marginTop: 15}} onClick={backToHome}><FaAngleLeft/> Volver</button>)}
        {showAcceptButton === true && ( <button className="tutor-button" style={{marginTop: 15}} onClick={openChat}> Aceptar tutoría</button>)}
      </div>
      
      
    </div>
  )
}

export default StudentModal;
