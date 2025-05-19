import React, { useContext } from "react";
import Header from "../components/Header";
import RequestBox from "../components/RequestBox";
import StudentSidebar from "./StudentSidebar";
import { SidebarContext } from "../contexts/SidebarContext";

function TutorScreen() {

    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);

    return(
        <div>
            <Header/>
            <RequestBox avatar={"https://randomuser.me/api/portraits/men/12.jpg"} />
            <RequestBox avatar={"https://randomuser.me/api/portraits/men/12.jpg"} />
            <RequestBox avatar={"https://randomuser.me/api/portraits/men/12.jpg"} />
             {isSidebarClicked && (
                <>
                    <div 
                        className="overlay" 
                        onClick={() => setIsSidebarClicked(false)}
                    />
                    <StudentSidebar />
                </>
            )}
        </div>
    )
}

export default TutorScreen;