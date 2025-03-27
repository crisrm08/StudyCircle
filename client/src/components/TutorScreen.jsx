import React from "react";
import Header from "../components/Header";
import RequestBox from "../components/RequestBox";

function TutorScreen() {
    return(
        <div>
            <Header/>
            <RequestBox avatar={"https://randomuser.me/api/portraits/men/12.jpg"} />
            <RequestBox avatar={"https://randomuser.me/api/portraits/men/12.jpg"} />
            <RequestBox avatar={"https://randomuser.me/api/portraits/men/12.jpg"} />
        </div>
    )
}

export default TutorScreen;