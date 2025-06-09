import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import Header from "../Common/Header";
import StudentModal from "./StudentModal";
import StudentSidebar from "../Common/StudentSidebar";
import TutorSidebar from "../Common/TutorSidebar";
import StudentReviews from "./StudentReviews";
import { SidebarContext } from "../../contexts/SidebarContext";
import { MdEdit } from "react-icons/md";
import "../../css/studentProfileStyles/studentprofile.css";

function StudentProfileScreen() {
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const { role } = useContext(AuthContext);
    
    const navigate = useNavigate();

    const studentName = "Elvis García";
    const studentFullDescription = "Estudiante de primer año de la carrera de Ingeniería en Ciencias de la Computación en la Pontificia Universidad Católica Madre y Maestra. Me interesa mejorar mis habilidades en la asignatura de Ecuaciones Diferenciales, ya que no me fue muy bien en mi primer parcial y necesito reforzar."

    function goToEdit() {
        navigate("/edit-student-profile");
    }
    return(
        <div className="student-profile-screen">
            <Header />
            <div className="student-profile-container">
                <div className="right-section">
                    <div className="about-student">
                        <div className="about-student__scroll">
                            {role === "Student" && <MdEdit className="edit-button" size={30} onClick={goToEdit}/> }
                            <h2>Sobre {studentName}:</h2>
                            <hr/>
                            <p>{studentFullDescription}</p>
                        </div>
                    </div>
                    <StudentReviews 
                        reviews={[
                            { name: "Juan José", rating: 4, text: "Muy respetuoso...", avatar: "https://randomuser.me/api/portraits/men/42.jpg" },
                            { name: "José Ramón", rating: 5, text: "Atento...", avatar: "https://randomuser.me/api/portraits/men/53.jpg" },
                            { name: "Luisa Maria", rating: 3, text: "Flexible, pero no aprende muy rápido...", avatar: "https://randomuser.me/api/portraits/women/19.jpg" },
                        ]}
                    />
                </div>
                <div className="student-profile-card">
                    <StudentModal showAcceptButton={role}/>
                </div>
            </div>
            {isSidebarClicked && (
              <>
                <div
                  className="overlay"
                  onClick={() => setIsSidebarClicked(false)}
                />
                {role === "tutor"
                  ? <TutorSidebar />
                  : <StudentSidebar />}
              </>
            )}
        </div>
    )
}

export default StudentProfileScreen;