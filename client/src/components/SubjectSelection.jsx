import { use, useState } from "react";
import React from "react";
import Subject from "./Subject";
import Topic from "./Topic";

function SubjectSelection(params) {
    const [subject, setSubject] = useState("Cálculo");

    function changeSubject(subjct) {
        console.log(subjct);
        setSubject(subjct);
    }

    return(
        <div className="subject-selection">
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
                    <Topic topicName="Límites y continuidad"/>
                    <Topic topicName="Derivadas y su interpretación"/>
                    <Topic topicName="Aplicaciones de las derivadas"/>
                    <Topic topicName="Integrales definidas e indefinidas"/>
                    <Topic topicName="Técnicas de integración"/>
                    <Topic topicName="Teorema fundamental del cálculo"/>
                    <Topic topicName="Series y secuencias"/>
                    <Topic topicName="Ecuaciones diferenciales"/>
                    <Topic topicName="Teoría de los límites infinitos"/>
                    <Topic topicName="Cálculo multivariable"/>
                </div>
            }

            {subject === "Física" && 
                <div className="topic-container">
                    <Topic topicName="Cinemática y movimiento"/>
                    <Topic topicName="Leyes de Newton"/>
                    <Topic topicName="Trabajo, energía y potencia"/>
                    <Topic topicName="Leyes de la termodinámica"/>
                    <Topic topicName="Fluidos y su dinámica"/>
                    <Topic topicName="Electromagnetismo"/>
                    <Topic topicName="Ondas y sonido"/>
                    <Topic topicName="Óptica y luz"/>
                    <Topic topicName="Física nuclear"/>
                    <Topic topicName="Relatividad especial"/>
                </div>
            }

            {subject === "Química" && 
                <div className="topic-container">
                    <Topic topicName="Estructura atómica y modelos atómicos"/>
                    <Topic topicName="Enlaces químicos"/>
                    <Topic topicName="Termodinámica química"/>
                    <Topic topicName="Reacciones químicas y estequiometría"/>
                    <Topic topicName="Ácidos y bases"/>
                    <Topic topicName="Soluciones y concentraciones"/>
                    <Topic topicName="Química orgánica"/>
                    <Topic topicName="Química inorgánica"/>
                    <Topic topicName="Cinética química"/>
                    <Topic topicName="Equilibrio químico"/>
                </div>
            }

            {subject === "Programación" && 
                <div className="topic-container">
                    <Topic topicName="Programación Orientada a Objetos"/>
                    <Topic topicName="Estructuras de datos"/>
                    <Topic topicName="Algoritmos y complejidad computacional"/>
                    <Topic topicName="Bases de datos"/>
                    <Topic topicName="Programación web (HTML, CSS, JavaScript)"/>
                    <Topic topicName="Desarrollo móvil"/>
                    <Topic topicName="Patrones de diseño de software"/>
                    <Topic topicName="Lenguajes de programación (Python, Java, C++)"/>
                    <Topic topicName="Sistemas operativos y gestión de memoria"/>
                    <Topic topicName="Pruebas y depuración de código"/>
                </div>
            }

            {subject === "Álgebra" && 
                <div className="topic-container">
                    <Topic topicName="Álgebra lineal"/>
                    <Topic topicName="Ecuaciones lineales y no lineales"/>
                    <Topic topicName="Matrices y determinantes"/>
                    <Topic topicName="Vectores y geometría analítica"/>
                    <Topic topicName="Sistemas de ecuaciones"/>
                    <Topic topicName="Polinomios y factorización"/>
                    <Topic topicName="Teoría de grupos"/>
                    <Topic topicName="Espacios vectoriales"/>
                    <Topic topicName="Funciones y sus gráficas"/>
                    <Topic topicName="Teoría de anillos y cuerpos"/>
                </div>
            }    
            
        </div>
    );
}

export default SubjectSelection;