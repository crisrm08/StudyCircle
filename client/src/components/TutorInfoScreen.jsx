import React, {useContext} from "react";
import Header from "./Header";
import Modal from "./Modal";
import TutorReviews from "./TutorReviews";
import Sidebar from "./Sidebar";
import { SidebarContext } from "../contexts/SidebarContext";
import "../css/tutorinfoscreen.css";


function TutorInfoScreen() {
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
  
    const tutor = {
            id: 1,
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
            name: 'Carlos Pérez',
            occupation: 'Profesor',
            description: 'Apasionado por la enseñanza de matemáticas y física. Vamos a resolver tus dudas juntos.',
            fullDescription: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            pricePerHour: 1000,
            rating: 4.4,
            specialties: ["Cinemática y movimiento", "Ondas y sonido", "Física nuclear"]
        };
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
                  <h2>Sobre {tutor.name}:</h2>
                  <hr/>
                  <p>{tutor.fullDescription}</p>
                </div>
              </div>
              <TutorReviews 
                  reviews={[
                    { name: "Juan José", rating: 4, text: "Excelente explicación...", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
                    { name: "José Ramón", rating: 5, text: "Muy atento y claro...", avatar: "https://randomuser.me/api/portraits/men/52.jpg" },
                    { name: "Luisa Maria", rating: 3, text: "Explica un poco rápido...", avatar: "https://randomuser.me/api/portraits/women/18.jpg" },
                    { name: "Perla Massiel", rating: 5, text: "El mejor...", avatar: "https://randomuser.me/api/portraits/women/52.jpg" },
                    { name: "Miguel Castillo", rating: 4, text: "Explica muy claro...", avatar: "https://randomuser.me/api/portraits/men/51.jpg" },
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
                    <Sidebar />
                </>
            )}
      </div>
    )
}

export default TutorInfoScreen;