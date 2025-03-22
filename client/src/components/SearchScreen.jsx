import React from "react";
import Header from "./Header";
import SubjectSelection from "./SubjectSelection";
import '../css/searchscreen.css'

function SearchScreen() {
    return(
        <div>
            <Header/>
            <div className="Search-Screen">
                <SubjectSelection/>
            </div>
        </div>
    )
}

export default SearchScreen;

