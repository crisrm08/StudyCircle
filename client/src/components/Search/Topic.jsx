import React from "react";

function Topic(props) {

    function handleClick() {
        props.onChange(props.topicName);
    }

    return(
        <div>
            <button className={props.selectedTopic === props.topicName ? "active" : ""} onClick={handleClick}>{props.topicName}</button>
        </div>
    )
}

export default Topic;