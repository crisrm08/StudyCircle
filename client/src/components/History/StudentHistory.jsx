import React, {useState} from "react";
import { FaHistory } from "react-icons/fa";
import HistoryLog from "./HistoryLog";
import "../../css/studentHistoryStyles/studenthistory.css";

function StudentHistory() {
    const [hasData] = useState(true);
    return(
        <div className="stu-history">
            <div className="history-title-container">
                <h1 className="history-title">Historial</h1>
            </div>
            <div className="history-logs-container">
                <div className="logs">
                   <div className="logs__scroll">
                        {hasData === true ? (
                            <>
                                <HistoryLog 
                                    tutorName="Julio Morales"
                                    date="27/4/2025"
                                    topic="Cálculo"
                                    subtopic="Integrales"
                                    rating={2}
                                    modality="presencial"
                                    avatar="https://randomuser.me/api/portraits/men/25.jpg"
                                    showRequestButton = {true}
                                />

                                <HistoryLog 
                                    tutorName="Julio Morales"
                                    date="27/4/2025"
                                    topic="Cálculo"
                                    subtopic="Derivadas"
                                    rating={3}
                                    modality="presencial"
                                    avatar="https://randomuser.me/api/portraits/men/25.jpg"
                                    showRequestButton = {true}
                                />

                                <HistoryLog 
                                    tutorName="Cecilia López"
                                    date="12/4/2025"
                                    topic="Álgebra"
                                    subtopic="Álgebra lineal"
                                    rating={4}
                                    modality="presencial"
                                    avatar="https://randomuser.me/api/portraits/women/25.jpg"
                                    showRequestButton = {true}
                                />

                                <HistoryLog 
                                    tutorName="Jeffrey Pérez"
                                    date="1/4/2025"
                                    topic="Programación"
                                    subtopic="Control de Versiones"
                                    rating={5}
                                    modality="virtual"
                                    avatar="https://randomuser.me/api/portraits/men/26.jpg"
                                    showRequestButton = {true}
                                />
                            </>
                        ) : (
                            <h1>Aquí aparecerán tus sesiones de tutorías previas</h1>
                        )}
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