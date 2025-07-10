import React, { useContext } from "react";
import Header from "../Common/Header";
import StudentFactsModal from "./StudentFactsModal";
import TutorSidebar from "../Common/TutorSidebar";
import StudentCritiques from "./StudentCritiques";
import { SidebarContext } from "../../contexts/SidebarContext";
import "../../css/studentProfileStyles/studentprofile.css";

function StudentFactsScreen() {
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const studentName = "Nombre";
    const studentFullDescription = "Descripción";

    return(
        <div className="student-profile-screen">
            <Header />
            <div className="student-profile-container">
                <div className="right-section">
                    <div className="about-student">
                        <div className="about-student__scroll">
                         
                            <h2>Sobre {studentName}:</h2>
                            <hr/>
                            <p>{studentFullDescription}</p>
                        </div>
                    </div>
                    <StudentCritiques 
                        reviews={[
                            { name: "Juan José", rating: 4, text: "Muy respetuoso...", avatar: "https://randomuser.me/api/portraits/men/42.jpg" },
                            { name: "José Ramón", rating: 5, text: "Atento...", avatar: "https://randomuser.me/api/portraits/men/53.jpg" },
                            { name: "Luisa Maria", rating: 3, text: "Flexible, pero no aprende muy rápido...", avatar: "https://randomuser.me/api/portraits/women/19.jpg" },
                        ]}
                    />
                </div>
                <div className="student-profile-card">
                    <StudentFactsModal />
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

export default StudentFactsScreen;