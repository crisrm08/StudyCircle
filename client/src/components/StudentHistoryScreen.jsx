import React, {useContext} from "react";
import { SidebarContext } from "../contexts/SidebarContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StudentHistory from "./StudentHistory";
import "../css/studenthistoryscreen.css";

function StudentHistoryScreen() {
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    return(
        <div className="stu-history-screen">
            <Header />
            <div className="main-history-container" >
                <StudentHistory />
            </div>
            {isSidebarClicked && (
                <>
                    <div className="overlay" onClick={() => setIsSidebarClicked(false)}/>
                    <Sidebar />
                </>
            )}
        </div>
    )
}

export default StudentHistoryScreen