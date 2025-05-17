import React from "react";
import { SidebarContext } from "../contexts/SidebarContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StudentHistory from "./StudentHistory";
import "../css/studenthistoryscreen.css";

function StudentHistoryScreen() {
    return(
        <div className="stu-history-screen">
            <Header />
            <div className="main-history-container" >
                <StudentHistory />
            </div>
        </div>
    )
}

export default StudentHistoryScreen