import React, { useContext } from "react";
import Header from "../components/Header";
import RequestBox from "../components/RequestBox";
import Sidebar from "./Sidebar";
import { SidebarContext } from "../contexts/SidebarContext";

function TutorScreen() {

    const { isSidebarClicked } = useContext(SidebarContext);

    return(
        <div>
            <Header/>
            <RequestBox avatar={"https://randomuser.me/api/portraits/men/12.jpg"} />
            <RequestBox avatar={"https://randomuser.me/api/portraits/men/12.jpg"} />
            <RequestBox avatar={"https://randomuser.me/api/portraits/men/12.jpg"} />
            {isSidebarClicked && <Sidebar />}
        </div>
    )
}

export default TutorScreen;