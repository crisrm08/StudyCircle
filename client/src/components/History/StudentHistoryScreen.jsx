import React, {useContext} from "react";
import { SidebarContext } from "../../contexts/SidebarContext";
import StudentSidebar from "../Common/StudentSidebar";
import Header from "../Common/Header";
import StudentHistory from "./StudentHistory";
import "../../css/studentHistoryStyles/studenthistoryscreen.css";

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
                    <StudentSidebar />
                </>
            )}
        </div>
    )
}

export default StudentHistoryScreen