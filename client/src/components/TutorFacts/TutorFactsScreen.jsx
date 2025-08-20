import React, {useContext, useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../Common/Header";
import TutorFactsModal from "./TutorFactsModal";
import TutorCritiques from "./TutorCritiques";
import StudentSidebar from "../Common/StudentSidebar";
import { SidebarContext } from "../../contexts/SidebarContext";
import axios from "axios";
import "../../css/tutorInfoStyles/tutorinfoscreen.css";

function TutorFactsScreen() {
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const { id } = useParams();
    const [tutor, setTutor] = useState(null);

    useEffect(() => { axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tutor/${id}`)
        .then(({ data }) => setTutor(data.tutor))        
        .catch(console.error);
    }, [id]);

  if (!tutor) return null
  
  return (
      <div className="tutor-info-screen">
        <Header />
        <div className="tutor-info-container">
          <div className="tutor-full-description">
              <TutorFactsModal tutor={tutor}/>
          </div>

          <div className="right-section">
            <div className="about-tutor">
              <div className="about-tutor__scroll">
                <h2>Sobre {tutor.name}:</h2>
                <hr/>
                <p>{tutor.fullDescription}</p>
              </div>
            </div>
            <TutorCritiques 
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
              <StudentSidebar />
            </>
        )}
    </div>
  )
}

export default TutorFactsScreen;