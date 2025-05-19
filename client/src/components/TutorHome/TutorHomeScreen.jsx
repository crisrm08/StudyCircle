import React, { useContext } from "react";
import Header from "../Common/Header";
import RequestBox from "../TutorHome/RequestBox";
import StudentSidebar from "../Common/StudentSidebar";
import { SidebarContext } from "../../contexts/SidebarContext";

function TutorHomeScreen() {

    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);

    return(
        <div>
            <Header/>
            <RequestBox avatar={"https://randomuser.me/api/portraits/men/12.jpg"} />
            <RequestBox avatar={"https://randomuser.me/api/portraits/men/12.jpg"} />
            <RequestBox avatar={"https://randomuser.me/api/portraits/men/12.jpg"} />
             {isSidebarClicked && (
                <>
                    <div className="overlay" onClick={() => setIsSidebarClicked(false)}/>
                    <StudentSidebar />
                </>
            )}
        </div>
    )
}

export default TutorHomeScreen;