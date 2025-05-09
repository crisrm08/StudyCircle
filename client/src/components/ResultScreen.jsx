import React, { useState, useContext } from "react";
import { SidebarContext } from "../contexts/SidebarContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
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
        rating: 0,
        specialties: []
    });
    const [tutorClicked, setTutorClicked] = useState(false);
    const { isSidebarClicked } = useContext(SidebarContext);

    function openModal(id, image, name, occupation, description, pricePerHour, rating, specialties) {
        setTutor({ id, image, name, occupation, description, pricePerHour, rating, specialties });
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
                    rating={4.4}
                    specialties={[
                        "Cinemática y movimiento", 
                        "Ondas y sonido", 
                        "Física nuclear"
                    ]}
                    onExplore={openModal}
                />

                <TutorProfileCard 
                    id="2"
                    image="https://randomuser.me/api/portraits/men/1.jpg"
                    name="Armando Paredes"
                    occupation="Estudiante de Ingeniería"
                    description="Estudiante avanzado de la carrera de Física para la educación superior"
                    pricePerHour="500"
                    rating={5}
                    specialties={[
                        "Leyes de Newton", 
                        "Cinemática y movimiento", 
                        "Trabajo, energía y potencia",
                        "Electromagnetismo",
                        "Leyes de la termonidinámica"
                    ]}
                    onExplore={openModal}
                />
                <TutorProfileCard 
                    id="3"
                    image="https://randomuser.me/api/portraits/women/30.jpg"
                    name="Elsa Capunta"
                    occupation="Ingeniera Civil"
                    description="Altos conocimientos de Cinemátca para compartir contigo"
                    pricePerHour="600"
                    rating={3.5}
                    specialties={[
                        "Cinemática y movimiento", 
                        "Fluidos y su dinámica"
                    ]}
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
                    specialties={[
                        "Cinemática y movimiento", 
                        "Óptica y luz", 
                        "Electromagnetismo",
                        "Ondas y sonido"
                    ]}
                    onExplore={openModal}
                />
                {tutorClicked && (<Modal tutor={tutor} onClose={() => setTutorClicked(false)}/>)}
            </div>
            {isSidebarClicked && <Sidebar />}
        </div>
    )
}

export default ResultScreen;