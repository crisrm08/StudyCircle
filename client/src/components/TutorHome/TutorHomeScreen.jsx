import React, { useContext, useState, useEffect} from "react";
import Header from "../Common/Header";
import TutorTopBar from "./TutorTopBar";
import TutorControlBar from "./TutorControlBar";
import RequestBox from "../TutorHome/RequestBox";
import HistoryLog from "../History/HistoryLog"
import TutorSidebar from "../Common/TutorSidebar";
import { useUser } from "../../contexts/UserContext";
import { SidebarContext } from "../../contexts/SidebarContext";
import { ActiveTabContext } from "../../contexts/ActiveTabContext";
import axios from "axios";
import "../../css/tutorHomeStyles/tutorhomescreen.css";

function TutorHomeScreen() {

    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const { user } = useUser();
    const { imageData } = useUser();
    const { userTeachedTopics } = useUser();
    const { loading } = useUser();
    const { activeTab } = useContext(ActiveTabContext);
    const [schedule, setSchedule] = useState([]);
    
    const daysOfWeek = [ "Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo" ];

    useEffect(() => {
      if (!user) return;
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/tutor-availability`, { params: { tutor_id: user.user_id }})
        .then(({ data }) => {
        console.log("Schedule data:", data.availability);

          const init = daysOfWeek.reduce((acc, d) => {
            acc[d] = null;
            return acc;
          }, {});
      
          data.availability.forEach(({ day_of_week, start_time, end_time }) => {
            init[day_of_week] = {
              from: start_time.slice(0,5),   
              to:   end_time.slice(0,5)     
            };
          });
          setSchedule(data.availability);
        })
        .catch(console.error);
    }, [user]);

    if (loading || !user) return null;
    
    return(
        <div>
            <Header/>
            <TutorTopBar 
                name={user.name}
                last_name={user.last_name}
                avatar={imageData}
                rating={4}
                subjects={userTeachedTopics}
                price={user.hourly_fee}
                schedule={schedule}
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