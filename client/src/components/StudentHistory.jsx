import React from "react";
import { FaHistory } from "react-icons/fa";
import HistoryLog from "./HistoryLog";
import "../css/studenthistory.css";

function StudentHistory() {
    return(
        <div className="stu-history">
            <div className="history-title-container">
                <h1 className="history-title">Historial</h1>
            </div>
            <div className="history-logs-container">
                <div className="logs">
                    <div className="logs__scroll" >
                        <HistoryLog 
                        tutorName= "Julio Morales"
                        date= "27/4/2025"
                        topic= "Cálculo"
                        subtopic= "Integrales"
                        rating={2}
                        modality= "presencial"
                        avatar= "https://randomuser.me/api/portraits/men/25.jpg"
                        />

                        <HistoryLog 
                        tutorName= "Julio Morales"
                        date= "27/4/2025"
                        topic= "Cálculo"
                        subtopic= "Derivadas"
                        rating={3}
                        modality= "presencial"
                        avatar= "https://randomuser.me/api/portraits/men/25.jpg"
                        />

                        <HistoryLog 
                        tutorName= "Cecilia López"
                        date= "12/4/2025"
                        topic= "Álgebra"
                        subtopic= "Álgebra lineal"
                        rating={4}
                        modality= "presencial"
                        avatar= "https://randomuser.me/api/portraits/women/25.jpg"
                        />

                        <HistoryLog 
                        tutorName= "Jeffrey Pérez"
                        date= "1/4/2025"
                        topic= "Programación"
                        subtopic= "Control de Versiones"
                        rating={5}
                        modality= "virtual"
                        avatar= "https://randomuser.me/api/portraits/men/26.jpg"
                        />
                    </div>
                </div>
                <div className="icon-container">
                    <FaHistory className="history-icon" size={250}/>
                </div>
            </div>
        </div>
    )
}

export default StudentHistory;