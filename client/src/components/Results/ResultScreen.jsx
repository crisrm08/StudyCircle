import React, { useContext, useState, useEffect } from "react";
import { SidebarContext } from "../../contexts/SidebarContext";
import { SubjectTopicContext } from "../../contexts/SubjectTopicContext";
import { TimeContext } from "../../contexts/TimeContext";
import Header from "../Common/Header";
import StudentSidebar from "../Common/StudentSidebar";
import TutorProfileCard from "./TutorProfileCard";
import LoadingScreen from "../Common/LoadingScreen";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/resultsStyle/resultscreen.css";

function ResultScreen() {
    const navigate = useNavigate();  
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const { topic, setTopic } = useContext(SubjectTopicContext);
    const { day, setDay, hour, setHour } = useContext(TimeContext);
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = {};
        if (topic) params.topic = topic;
        if (day)   params.day   = day;
        if (hour)  params.hour  = hour.toString();

        setLoading(true);
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tutors`, { params })
            .then(({ data }) => {
                setTutors(data.tutors);
                setLoading(false);
                console.log(data.tutors);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, [topic, day, hour]);

    useEffect(() => {
        const handlePopState = (event) => { navigate("/", { replace: true });};

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [navigate]);

    return(
        <div>
            {loading ? (
                <LoadingScreen />
            ) : (
                <div>
                    <Header/>
                    <div className={`result-screen ${tutors.length === 0 ? "no-results" : ""}`}>
                        {tutors.length === 0
                            ? <h1>No se encontraron tutores que coincidan con tu búsqueda</h1>
                            : tutors.map(t => (
                                <TutorProfileCard
                                    key={t.id}
                                    id={t.id}
                                    image={t.image}
                                    name={t.name}
                                    occupation={t.occupation}
                                    description={t.description}
                                    pricePerHour={t.pricePerHour}
                                    rating={t.rating}
                                    specialties={t.specialties}
                                    onExplore={() => navigate(`/tutor-facts/${t.id}`)}
                                />
                            ))
                        }
                    </div>
                </div>
            )}
            {isSidebarClicked && (
                <>
                    <div className="overlay" onClick={() => setIsSidebarClicked(false)}/>
                    <StudentSidebar />
                </>
            )}
        </div>
    )
}

export default ResultScreen;
