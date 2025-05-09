import React, { useContext } from "react";
import Header from "./Header";
import SubjectSelection from "./SubjectSelection";
import Sidebar from "./Sidebar";
import { SidebarContext } from "../contexts/SidebarContext";
import TimeSelection from "./TimeSelection";
import ModeSelection from "./ModeSelection";
import '../css/searchscreen.css';

function SearchScreen() {
    const { isSidebarClicked } = useContext(SidebarContext);
    
    return(
        <div>
            <Header/>
            <div className="Search-Screen">
                <SubjectSelection/>
                <TimeSelection/>
                <ModeSelection/>
            </div>
            {isSidebarClicked && <Sidebar />}
        </div>
    )
}

export default SearchScreen;

