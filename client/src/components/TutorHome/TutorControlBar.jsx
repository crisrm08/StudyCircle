import React, {useState} from "react";
import "../../css/tutorHomeStyles/tutorcontrolbar.css"

function TutorControlBar() {
    const [ activeTab, setActiveTab ] = useState("");
    return(
        <div className="tutor-control-bar">
            <h1 onClick={() => setActiveTab("Historial")} className={activeTab === "Historial" ? "active" : ""}>Historial</h1>
            <span>|</span>
            <h1 onClick={() => setActiveTab("Solicitudes")} className={activeTab === "Solicitudes" ? "active" : ""}>Solicitudes</h1>
        </div>
    )
}

export default TutorControlBar;