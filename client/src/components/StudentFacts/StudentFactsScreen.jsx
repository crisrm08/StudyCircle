import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../Common/Header";
import StudentFactsModal from "./StudentFactsModal";
import TutorSidebar from "../Common/TutorSidebar";
import StudentCritiques from "./StudentCritiques";
import { SidebarContext } from "../../contexts/SidebarContext";
import axios from "axios";
import "../../css/studentProfileStyles/studentprofile.css";

function StudentFactsScreen() {
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const { id } = useParams();
    const [student, setStudent] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/students/${id}`)
        .then(({ data }) => setStudent(data.student))
        .catch(console.error);
    }, [id]);

    if (!student) return null;

    return(
        <div className="student-profile-screen">
            <Header />
            <div className="student-profile-container">
                <div className="right-section">
                    <div className="about-student">
                        <div className="about-student__scroll">
                         
                            <h2>Sobre {student.name}:</h2>
                            <hr/>
                            <p>{student.description}</p>
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
                    <StudentFactsModal student={student}/>
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