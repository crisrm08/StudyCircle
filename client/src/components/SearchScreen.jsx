import React from "react";
import Header from "./Header";
import SubjectSelection from "./SubjectSelection";
import TimeSelection from "./TimeSelection";
import ModeSelection from "./ModeSelection";
import '../css/searchscreen.css'

function SearchScreen() {
    return(
        <div>
            <Header/>
            <div className="Search-Screen">
                <SubjectSelection/>
                <TimeSelection/>
                <ModeSelection/>
            </div>
        </div>
    )
}

export default SearchScreen;

