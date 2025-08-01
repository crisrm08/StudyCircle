import React, {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Common/Header";
import Modal from "./Modal";
import TutorReviews from "./TutorReviews";
import { useUser } from "../../contexts/UserContext";
import TutorSidebar from "../Common/TutorSidebar";
import { SidebarContext } from "../../contexts/SidebarContext";
import { MdEdit } from "react-icons/md";
import "../../css/tutorInfoStyles/tutorinfoscreen.css";

function TutorProfileScreen() {
    const navigate = useNavigate();
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const { user, imageData, userOcupationName, userAcademicLevelName, userTeachedTopics } = useUser();
    const [tutor, setTutor] = useState({
        id: 1,
        image: null,
        name: "",
        last_name: "",
        occupation: "",
        institution: "",
        academicLevel: "",
        description: "",
        fullDescription: "",
        pricePerHour: "",
        rating: 0,
        specialties: []
    })
  

    useEffect(() => {
      if (!user) return
        setTutor({
          id: user.user_id,
          image: imageData,
          name: user.name,
          last_name: user.last_name,
          occupation: userOcupationName,
          institution: user.institution,
          academicLevel: userAcademicLevelName,
          description: user.short_description,
          fullDescription: user.full_description,
          pricePerHour: user.hourly_fee,
          rating: user.rating_avg,
          reports: user.report_count,
          specialties: userTeachedTopics
        });
    },[user, imageData, userTeachedTopics]);

    function goToEdit() {
        navigate("/edit-tutor-profile");
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
                <MdEdit className="edit-button" size={30} onClick={goToEdit}/>
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
                <TutorSidebar />
              </>
          )}
      </div>
    )
}

export default TutorProfileScreen;