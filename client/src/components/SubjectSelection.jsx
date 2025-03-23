import { use, useState } from "react";
import React from "react";
import Subject from "./Subject";
import Topic from "./Topic";
import "../css/subjectselection.css";

function SubjectSelection(params) {
    const [subject, setSubject] = useState("Cálculo");
    const [topic, setTopic] = useState("");

    function changeSubject(subjct) {
        setSubject(subjct);
    }

    function changeTopic(tpc) {
        setTopic(tpc);
    }

    console.log(subject);
    console.log(topic);
    
    
    return(
        <div className="subject-selection-container">
            <h1>En qué asignatura necesitas ayuda?</h1>

            <div className="subjects-container">
                <Subject subjectName="Cálculo" onChange={changeSubject}/>
                <Subject subjectName="Física" onChange={changeSubject}/>
                <Subject subjectName="Química" onChange={changeSubject}/>
                <Subject subjectName="Programación" onChange={changeSubject}/>
                <Subject subjectName="Álgebra" onChange={changeSubject}/>
            </div>

            {subject === "Cálculo" && 
                <div className="topic-container">
                    <Topic topicName="Límites y continuidad" onChange={changeTopic}/>
                    <Topic topicName="Derivadas y su interpretación" onChange={changeTopic}/>
                    <Topic topicName="Aplicaciones de las derivadas" onChange={changeTopic}/>
                    <Topic topicName="Integrales definidas e indefinidas"onChange={changeTopic}/>
                    <Topic topicName="Técnicas de integración" onChange={changeTopic}/>
                    <Topic topicName="Teorema fundamental del cálculo " onChange={changeTopic}/>
                    <Topic topicName="Series y secuencias" onChange={changeTopic}/>
                    <Topic topicName="Ecuaciones diferenciales" onChange={changeTopic}/>
                    <Topic topicName="Teoría de los límites infinitos" onChange={changeTopic}/>
                    <Topic topicName="Cálculo multivariable" onChange={changeTopic}/>
                </div>
            }

            {subject === "Física" && 
                <div className="topic-container">
                    <Topic topicName="Leyes de Newton" onChange={changeTopic}/>
                    <Topic topicName="Trabajo, energía y potencia" onChange={changeTopic}/>
                    <Topic topicName="Cinemática y movimiento" onChange={changeTopic}/>
                    <Topic topicName="Leyes de la termodinámica" onChange={changeTopic}/>
                    <Topic topicName="Fluidos y su dinámica" onChange={changeTopic}/>
                    <Topic topicName="Electromagnetismo" onChange={changeTopic}/>
                    <Topic topicName="Ondas y sonido" onChange={changeTopic}/>
                    <Topic topicName="Óptica y luz" onChange={changeTopic}/>
                    <Topic topicName="Física nuclear" onChange={changeTopic}/>
                    <Topic topicName="Relatividad especial" onChange={changeTopic}/>
                </div>
            }

            {subject === "Química" && 
                <div className="topic-container">
                    <Topic topicName="Estructura atómica y modelos atómicos" onChange={changeTopic}/>
                    <Topic topicName="Enlaces químicos" onChange={changeTopic}/>
                    <Topic topicName="Termodinámica química" onChange={changeTopic}/>
                    <Topic topicName="Reacciones químicas y estequiometría" onChange={changeTopic}/>
                    <Topic topicName="Ácidos y bases" onChange={changeTopic}/>
                    <Topic topicName="Soluciones y concentraciones" onChange={changeTopic}/>
                    <Topic topicName="Química orgánica" onChange={changeTopic}/>
                    <Topic topicName="Química inorgánica" onChange={changeTopic}/>
                    <Topic topicName="Cinética química" onChange={changeTopic}/>
                    <Topic topicName="Equilibrio químico" onChange={changeTopic}/>
                </div>
            }

            {subject === "Programación" && 
                <div className="topic-container">
                    <Topic topicName="Programación Orientada a Objetos" onChange={changeTopic}/>
                    <Topic topicName="Estructuras de datos"/>
                    <Topic topicName="Algoritmos y complejidad computacional" onChange={changeTopic}/>
                    <Topic topicName="Bases de datos"/>
                    <Topic topicName="Programación web (HTML, CSS, JavaScript)" onChange={changeTopic}/>
                    <Topic topicName="Desarrollo móvil" onChange={changeTopic}/>
                    <Topic topicName="Patrones de diseño de software" onChange={changeTopic}/>
                    <Topic topicName="Lenguajes de programación (Python, Java, C++)" onChange={changeTopic}/>
                    <Topic topicName="Sistemas operativos y gestión de memoria" onChange={changeTopic}/>
                    <Topic topicName="Pruebas y depuración de código" onChange={changeTopic}/>
                </div>
            }

            {subject === "Álgebra" && 
                <div className="topic-container">
                    <Topic topicName="Álgebra lineal" onChange={changeTopic}/>
                    <Topic topicName="Ecuaciones lineales y no lineales" onChange={changeTopic}/>
                    <Topic topicName="Matrices y determinantes" onChange={changeTopic}/>
                    <Topic topicName="Vectores y geometría analítica" onChange={changeTopic}/>
                    <Topic topicName="Sistemas de ecuaciones" onChange={changeTopic}/>
                    <Topic topicName="Polinomios y factorización" onChange={changeTopic}/>
                    <Topic topicName="Teoría de grupos" onChange={changeTopic}/>
                    <Topic topicName="Espacios vectoriales" onChange={changeTopic}/>
                    <Topic topicName="Funciones y sus gráficas" onChange={changeTopic}/>
                    <Topic topicName="Teoría de anillos y cuerpos" onChange={changeTopic}/>
                </div>
            }    
            
        </div>
    );
}

export default SubjectSelection;