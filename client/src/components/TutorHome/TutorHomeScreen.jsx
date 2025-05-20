import React, { useContext } from "react";
import Header from "../Common/Header";
import TutorTopBar from "./TutorTopBar";
import TutorControlBar from "./TutorControlBar";
import RequestBox from "../TutorHome/RequestBox";
import HistoryLog from "../History/HistoryLog"
import StudentSidebar from "../Common/StudentSidebar";
import { SidebarContext } from "../../contexts/SidebarContext";
import "../../css/tutorHomeStyles/tutorhomescreen.css";

function TutorHomeScreen() {

    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);

    return(
        <div>
            <Header/>
            <TutorTopBar 
                name="Carlos Santana"
                avatar="https://randomuser.me/api/portraits/men/32.jpg"
                rating={4}
                subjects={["Derivadas", "Series y secuencias", "Límites", "Ecuaciones", "Integrales"]}
                price={800}
                schedule={["Lunes 16:00 - 18:00", "Miércoles 19:00 - 22:00"]}
            />
            <TutorControlBar /> 

            <div className="tutorship-request-container">
                <RequestBox avatar={"https://randomuser.me/api/portraits/men/12.jpg"} />
                <RequestBox avatar={"https://randomuser.me/api/portraits/men/15.jpg"} />
                <RequestBox avatar={"https://randomuser.me/api/portraits/men/16.jpg"} />
                <RequestBox avatar={"https://randomuser.me/api/portraits/men/16.jpg"} />
            </div>

           

            {isSidebarClicked && (
                <>
                    <div className="overlay" onClick={() => setIsSidebarClicked(false)}/>
                    <StudentSidebar />
                </>
            )}
        </div>
    )
}

export default TutorHomeScreen;