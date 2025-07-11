import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { SubjectTopicContext } from "../../contexts/SubjectTopicContext";
import { TimeContext } from "../../contexts/TimeContext";
import Header from "../Common/Header";
import SubjectSelection from "./SubjectSelection";
import StudentSidebar from "../Common/StudentSidebar";
import { SidebarContext } from "../../contexts/SidebarContext";
import TimeSelection from "./TimeSelection";
import ModeSelection from "./ModeSelection";
import '../../css/searchStyles/searchscreen.css';

function SearchScreen() {
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const { setTopic } = useContext(SubjectTopicContext);
    const { setDay, setHour } = useContext(TimeContext);

    const navigate = useNavigate();
    const { user , loading} = useUser();

    useEffect(() => {
        setTopic(null);
        setDay("");
        setHour(null);
    }, [setTopic, setDay, setHour]);

    useEffect(() => {
        if (!loading && user?.profile_type === "tutor") {
        navigate("/tutor-home-page", { replace: true });
        }
    }, [user, loading, navigate]);

    if (loading) return null; 
    
    return(
        <div>
            <Header/>
            <div className="Search-Screen">
                <SubjectSelection/>
                <TimeSelection/>
                <ModeSelection/>
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

export default SearchScreen;

