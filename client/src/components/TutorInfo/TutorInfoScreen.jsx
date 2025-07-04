import React, {useContext, useState} from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Common/Header";
import Modal from "./Modal";
import TutorReviews from "./TutorReviews";
import { useUser } from "../../contexts/UserContext";
import StudentSidebar from "../Common/StudentSidebar";
import TutorSidebar from "../Common/TutorSidebar";
import { SidebarContext } from "../../contexts/SidebarContext";
import { MdEdit } from "react-icons/md";
import "../../css/tutorInfoStyles/tutorinfoscreen.css";

function TutorInfoScreen() {
    const navigate = useNavigate();
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const { user } = useUser();
  
    const tutor = {
            id: 1,
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
            name: 'Carlos Santana',
            occupation: 'Profesor',
            institution: "INTEC",
            academicLevel: "Maestría",
            description: 'Apasionado por la enseñanza de matemáticas y física. Vamos a resolver tus dudas juntos.',
            fullDescription: "Docente egresado de la Universidad Autónoma de Santo Domingo de la carrera de Física. Cuento con más de 10 años de experiencia dedicados a la docencia de estudiantes universitarios en el Insituto Tecnológico de Santo Domingo.",
            pricePerHour: 1000,
            rating: 4.4,
            specialties: ["Cinemática y movimiento", "Ondas y sonido", "Física nuclear", "Electromagnetismo", "Termodinámica"]
        };

    function goToEdit() {
      if (user.profile_type === "tutor") {
        navigate("/edit-tutor-profile");
      }
      else{
        navigate("/edit-student-profile");
      }
    }

    return(
        <div className="tutor-info-screen">
          <Header />
          <div className="tutor-info-container">
            <div className="tutor-full-description">
                <Modal tutor={tutor}/>
            </div>

            <div className="right-section">
              <div className="about-tutor">
                <div className="about-tutor__scroll">
                  {user.profile_type === "tutor" && (<MdEdit className="edit-button" size={30} onClick={goToEdit}/>)}
                  <h2>Sobre {tutor.name}:</h2>
                  <hr/>
                  <p>{tutor.fullDescription}</p>
                </div>
              </div>
              <TutorReviews 
                  reviews={[
                    { name: "Juan José", rating: 4, text: "Excelente explicación...", avatar: "https://randomuser.me/api/portraits/men/32.jpg", topic: "Cinemática" },
                    { name: "José Ramón", rating: 5, text: "Muy atento y claro...", avatar: "https://randomuser.me/api/portraits/men/52.jpg", topic: "Ondas y sonido" },
                    { name: "Luisa Maria", rating: 3, text: "Explica un poco rápido...", avatar: "https://randomuser.me/api/portraits/women/18.jpg", topic: "Física nuclear" },
                    { name: "Perla Massiel", rating: 5, text: "El mejor...", avatar: "https://randomuser.me/api/portraits/women/52.jpg", topic: "Termodinámica" },
                    { name: "Miguel Castillo", rating: 4, text: "Explica muy claro...", avatar: "https://randomuser.me/api/portraits/men/51.jpg", topic: "Electromagnetismo" },
                  ]}
              />
            </div>
          </div>
          {isSidebarClicked && (
              <>
                <div
                  className="overlay"
                  onClick={() => setIsSidebarClicked(false)}
                />
                {user.profile_type === "tutor"
                  ? <TutorSidebar />
                  : <StudentSidebar />
                }
              </>
          )}
      </div>
    )
}

export default TutorInfoScreen;