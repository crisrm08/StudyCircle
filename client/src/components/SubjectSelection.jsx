import { use, useState } from "react";
import React from "react";
import Subject from "./Subject";
import Topic from "./Topic";
import "../css/subjectselection.css";

function SubjectSelection(params) {
    const [subject, setSubject] = useState("🧮 Cálculo");
    const [topic, setTopic] = useState("");

    function changeSubject(subjct) {
        setSubject(subjct);
        setTopic("");
    }

    function changeTopic(tpc) {
        setTopic(tpc);
    }

    return(
        <div className="subject-selection-container">
            <h1>En qué asignatura necesitas ayuda?</h1>

            <div className="subjects-container">
                <Subject subjectName="🧮 Cálculo" onChange={changeSubject} selectedSubject={subject} />
                <Subject subjectName="🔭 Física" onChange={changeSubject} selectedSubject={subject}  />
                <Subject subjectName="⚗️ Química" onChange={changeSubject} selectedSubject={subject}  />
                <Subject subjectName="💻 Programación" onChange={changeSubject} selectedSubject={subject} />
                <Subject subjectName="📐 Álgebra" onChange={changeSubject} selectedSubject={subject}  />
            </div>


            {subject === "🧮 Cálculo" && 
                <div className="topics-container">
                    <Topic topicName="Límites y continuidad" onChange={changeTopic}  selectedTopic={topic}/>
                    <Topic topicName="Derivadas y su interpretación" onChange={changeTopic}  selectedTopic={topic}/>
                    <Topic topicName="Aplicaciones de las derivadas" onChange={changeTopic}  selectedTopic={topic}/>
                    <Topic topicName="Integrales definidas e indefinidas"onChange={changeTopic}  selectedTopic={topic}/>
                    <Topic topicName="Técnicas de integración" onChange={changeTopic}  selectedTopic={topic}/>
                    <Topic topicName="Teorema fundamental del cálculo " onChange={changeTopic}  selectedTopic={topic}/>
                    <Topic topicName="Series y secuencias" onChange={changeTopic}  selectedTopic={topic}/>
                    <Topic topicName="Ecuaciones diferenciales" onChange={changeTopic}  selectedTopic={topic}/>
                    <Topic topicName="Teoría de los límites infinitos" onChange={changeTopic}  selectedTopic={topic}/>
                    <Topic topicName="Cálculo multivariable" onChange={changeTopic}  selectedTopic={topic}/>
                    <Topic topicName="Otro" onChange={changeTopic}  selectedTopic={topic}/>
                </div>
            }

            {subject === "🔭 Física" && 
                <div className= "topics-container">
                    <Topic topicName="Leyes de Newton" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Trabajo, energía y potencia" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Cinemática y movimiento" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Leyes de la termodinámica" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Fluidos y su dinámica" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Electromagnetismo" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Ondas y sonido" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Óptica y luz" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Física nuclear" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Relatividad especial" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Otro" onChange={changeTopic} selectedTopic={topic}/>
                </div>
            }

            {subject === "⚗️ Química" && 
                <div className={"topics-container"}>
                    <Topic topicName="Estructura atómica y modelos atómicos" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Enlaces químicos" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Termodinámica química" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Reacciones químicas y estequiometría" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Ácidos y bases" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Soluciones y concentraciones" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Química orgánica" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Química inorgánica" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Cinética química" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Equilibrio químico" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Otro" onChange={changeTopic} selectedTopic={topic}/>
                </div>
            }

            {subject === "💻 Programación" && 
                <div className={"topics-container"}>
                    <Topic topicName="Programación Orientada a Objetos" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Estructuras de datos" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Algoritmos y complejidad computacional" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Bases de datos" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Programación web (HTML, CSS, JavaScript)" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Desarrollo móvil" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Patrones de diseño de software" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Lenguajes de programación (Python, Java, C++)" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Sistemas operativos y gestión de memoria" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Pruebas y depuración de código" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Otro" onChange={changeTopic} selectedTopic={topic}/>
                </div>
            }

            {subject === "📐 Álgebra" && 
                <div className="topics-container">
                    <Topic topicName="Álgebra lineal" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Ecuaciones lineales y no lineales" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Matrices y determinantes" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Vectores y geometría analítica" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Sistemas de ecuaciones" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Polinomios y factorización" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Teoría de grupos" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Espacios vectoriales" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Funciones y sus gráficas" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Teoría de anillos y cuerpos" onChange={changeTopic} selectedTopic={topic}/>
                    <Topic topicName="Otro" onChange={changeTopic} selectedTopic={topic}/>
                </div>
            }    
            
        </div>
    );
}

export default SubjectSelection;