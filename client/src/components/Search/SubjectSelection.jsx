import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import Subject from "./Subject";
import Topic from "./Topic";
import { SubjectTopicContext } from "../../contexts/SubjectTopicContext";
import "../../css/searchStyles/subjectselection.css";

function SubjectSelection() {
    const { subject, setSubject, topic, setTopic } = useContext(SubjectTopicContext);
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/subjects-topics`)
            .then(response => {
                setSubjects(response.data);
                
                if (response.data.length > 0) {
                    setTopics(response.data[2].topics);
                    setSubject(response.data[2].name); 
                }
            })
            .catch(error => {
                console.error("Error fetching subjects: ", error);
            });
    }, []);
        

    function changeSubject(subjctName) {
        setSubject(subjctName);
        setTopic("");
        const found = subjects.find(s => s.name === subjctName);
        setTopics(found ? found.topics : []);
    }

    function changeTopic(tpc) {
        setTopic(tpc);
    }

    return(
        <div className="subject-selection-container">
            <h1>En qué asignatura necesitas ayuda?</h1>

            <div className="subjects-container">
                {subjects.map((subj) => (
                    <Subject
                        key={subj.id}
                        subjectName={subj.name}
                        onChange={changeSubject}
                        selectedSubject={subject}
                    />
                ))}
            </div>

            <div className="topics-container">
                {topics.map((tpc) => (
                    <Topic
                        key={tpc.id}
                        topicName={tpc.name}
                        onChange={changeTopic}
                        selectedTopic={topic}
                    />
                ))}
            </div>
        </div>    
    );
}

export default SubjectSelection;