import React from "react";

function Subject(props) {

    function handleClick() {
        props.onChange(props.subjectName);
    }

    return(
        <div>
            <button className={props.selectedSubject === props.subjectName ? "active" : ""} onClick={handleClick}>
                {props.subjectName}
            </button>
        </div>
    )
}

export default Subject;