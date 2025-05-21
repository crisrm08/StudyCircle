import React, { useContext } from "react";
import Header from "../Common/Header";
import TutorTopBar from "./TutorTopBar";
import TutorControlBar from "./TutorControlBar";
import RequestBox from "../TutorHome/RequestBox";
import HistoryLog from "../History/HistoryLog"
import TutorSidebar from "../Common/TutorSidebar";
import { SidebarContext } from "../../contexts/SidebarContext";
import { ActiveTabContext } from "../../contexts/ActiveTabContext";
import "../../css/tutorHomeStyles/tutorhomescreen.css";

function TutorHomeScreen() {

    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const { activeTab } = useContext(ActiveTabContext);

    return(
        <div>
            <Header/>
            <TutorTopBar 
                name="Carlos Santana"
                avatar="https://randomuser.me/api/portraits/men/32.jpg"
                rating={4}
                subjects={["Derivadas", "Series y secuencias", "Límites", "Ecuaciones", "Integrales"]}
                price={1000}
                schedule={["Lunes 16:00 - 18:00", "Miércoles 19:00 - 22:00"]}
            />
            <TutorControlBar /> 

        
            {activeTab === "Solicitudes" ? (
                <div className="tutorship-request-container">
                    <RequestBox avatar={"https://randomuser.me/api/portraits/men/12.jpg"} />
                    <RequestBox avatar={"https://randomuser.me/api/portraits/men/15.jpg"} />
                    <RequestBox avatar={"https://randomuser.me/api/portraits/men/16.jpg"} />
                    <RequestBox avatar={"https://randomuser.me/api/portraits/men/23.jpg"} />
                </div>
            ) : (
                <div className="tutor-history-container">
                    <HistoryLog 
                        tutorName="Julio Morales"
                        date="27/4/2025"
                        topic="Cálculo"
                        subtopic="Integrales"
                        rating={2}
                        modality="presencial"
                        avatar="https://randomuser.me/api/portraits/men/25.jpg"
                    />
                    <HistoryLog 
                        tutorName="Julio Morales"
                        date="27/4/2025"
                        topic="Cálculo"
                        subtopic="Derivadas"
                        rating={3}
                        modality="presencial"
                        avatar="https://randomuser.me/api/portraits/men/25.jpg"
                    />
                    <HistoryLog 
                        tutorName="Cecilia López"
                        date="12/4/2025"
                        topic="Álgebra"
                        subtopic="Álgebra lineal"
                        rating={4}
                        modality="presencial"
                        avatar="https://randomuser.me/api/portraits/women/25.jpg"
                    />
                    <HistoryLog 
                        tutorName="Jeffrey Pérez"
                        date="1/4/2025"
                        topic="Programación"
                        subtopic="Control de Versiones"
                        rating={5}
                        modality="virtual"
                        avatar="https://randomuser.me/api/portraits/men/26.jpg"
                    />
                     <HistoryLog 
                        tutorName="Julio Morales"
                        date="27/4/2025"
                        topic="Cálculo"
                        subtopic="Integrales"
                        rating={2}
                        modality="presencial"
                        avatar="https://randomuser.me/api/portraits/men/25.jpg"
                    />
                    <HistoryLog 
                        tutorName="Julio Morales"
                        date="27/4/2025"
                        topic="Cálculo"
                        subtopic="Derivadas"
                        rating={3}
                        modality="presencial"
                        avatar="https://randomuser.me/api/portraits/men/25.jpg"
                    />
                    <HistoryLog 
                        tutorName="Cecilia López"
                        date="12/4/2025"
                        topic="Álgebra"
                        subtopic="Álgebra lineal"
                        rating={4}
                        modality="presencial"
                        avatar="https://randomuser.me/api/portraits/women/25.jpg"
                    />
                    <HistoryLog 
                        tutorName="Jeffrey Pérez"
                        date="1/4/2025"
                        topic="Programación"
                        subtopic="Control de Versiones"
                        rating={5}
                        modality="virtual"
                        avatar="https://randomuser.me/api/portraits/men/26.jpg"
                    />
                     <HistoryLog 
                        tutorName="Julio Morales"
                        date="27/4/2025"
                        topic="Cálculo"
                        subtopic="Integrales"
                        rating={2}
                        modality="presencial"
                        avatar="https://randomuser.me/api/portraits/men/25.jpg"
                    />
                    <HistoryLog 
                        tutorName="Julio Morales"
                        date="27/4/2025"
                        topic="Cálculo"
                        subtopic="Derivadas"
                        rating={3}
                        modality="presencial"
                        avatar="https://randomuser.me/api/portraits/men/25.jpg"
                    />
                    <HistoryLog 
                        tutorName="Cecilia López"
                        date="12/4/2025"
                        topic="Álgebra"
                        subtopic="Álgebra lineal"
                        rating={4}
                        modality="presencial"
                        avatar="https://randomuser.me/api/portraits/women/25.jpg"
                    />
                    <HistoryLog 
                        tutorName="Jeffrey Pérez"
                        date="1/4/2025"
                        topic="Programación"
                        subtopic="Control de Versiones"
                        rating={5}
                        modality="virtual"
                        avatar="https://randomuser.me/api/portraits/men/26.jpg"
                    />
                
                </div>
            )}
            {isSidebarClicked && (
                <>
                    <div className="overlay" onClick={() => setIsSidebarClicked(false)}/>
                    <TutorSidebar />
                </>
            )}
        </div>
    )
}

export default TutorHomeScreen;