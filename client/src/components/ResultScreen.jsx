import React from "react";
import Header from "./Header";
import TutorProfileCard from "./TutorProfileCard";
import "../css/resultscreen.css";

function ResultScreen() {

    function openModal(id, image, name, occupation, description, pricePerHour, rating) {
        console.log("se abrira el modal");
        console.log(id, image, occupation, description, pricePerHour, rating);
    }

    return(
        <div>
            <Header/>
            <div className="result-screen">
            <TutorProfileCard 
                id="1"
                image="https://randomuser.me/api/portraits/men/32.jpg"
                name="Carlos Pérez"
                occupation="Profesor Intec"
                description="Apasionado por la enseñanza de matemáticas y física. Vamos a resolver tus dudas juntos"
                pricePerHour="1000"
                rating={4}
                onExplore={openModal}
            />
            <TutorProfileCard 
                id="2"
                image="https://randomuser.me/api/portraits/men/1.jpg"
                name="Armando Paredes"
                occupation="Estudiante de Ingeniería"
                description="Estudiante avanzado de la carrera de Matemáticas para la educación superior"
                pricePerHour="500"
                rating={5}
                onExplore={openModal}
            />
            <TutorProfileCard 
                id="3"
                image="https://randomuser.me/api/portraits/women/30.jpg"
                name="Elsa Capunta"
                occupation="Ingeniera Civil"
                description="Altos conocimientos de Derivadas e integrales para compartir contigo"
                pricePerHour="600"
                rating={3.5}
                onExplore={openModal}
            />
            <TutorProfileCard 
                id="4"
                image="https://randomuser.me/api/portraits/men/29.jpg"
                name="Elvis Tek"
                occupation="Docente Unphu"
                description="Apasionado por la enseñanza de matemáticas y física. Vamos a resolver tus dudas juntos"
                pricePerHour="800"
                rating={4.2}
                onExplore={openModal}
            />
            </div>
        </div>
    )
}

export default ResultScreen;