import React, { useContext } from "react";
import Header from "../Common/Header";
import SubjectSelection from "./SubjectSelection";
import StudentSidebar from "../Common/StudentSidebar";
import { SidebarContext } from "../../contexts/SidebarContext";
import TimeSelection from "./TimeSelection";
import ModeSelection from "./ModeSelection";
import '../../css/searchStyles/searchscreen.css';

function SearchScreen() {
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    
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

