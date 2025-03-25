import React, { useState } from "react";
import Header from "./Header";
import TutorProfileCard from "./TutorProfileCard";
import Modal from "./Modal";
import "../css/resultscreen.css";

function ResultScreen() {
    const [tutor, setTutor] = useState({
        id: null,
        image: '',
        name: '',
        occupation: '',
        description: '',
        pricePerHour: 0,
        rating: 0
    });
    const [tutorClicked, setTutorClicked] = useState(false);

    function openModal(id, image, name, occupation, description, pricePerHour, rating) {
        setTutor({ id, image, name, occupation, description, pricePerHour, rating });
        setTutorClicked(true);
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
                {tutorClicked && (<Modal tutor={tutor} onClose={() => setTutorClicked(false)}/>)}
            </div>
        </div>
    )
}

export default ResultScreen;