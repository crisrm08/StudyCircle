import React, { useContext, useEffect, useRef } from "react";
import { FiUser, FiMessageSquare, FiClock, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import '../css/sidebar.css';
import { SidebarContext } from "../../contexts/SidebarContext";

function TutorSidebar() {
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const sidebarRef = useRef();
    const navigate = useNavigate();

    useEffect(() =>  {
        function handleClickOutside(event) {
          if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsSidebarClicked(false);
          }
        }
    
        if (isSidebarClicked) {
          document.addEventListener("mousedown", handleClickOutside);
        }
    
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarClicked, setIsSidebarClicked]);

    function logOut() {
      navigate("/login");
      setIsSidebarClicked(false);
    }

    function goToChat() {
      navigate("/chat");
      setIsSidebarClicked(false);
    }

    function goToProfile() {
      navigate("/tutor-profile");
      setIsSidebarClicked(false);
    }

    function goToHome(params) {
      navigate("/student-history")
    }

    return (
      <div className={`sidebar ${isSidebarClicked ? "open" : ""}`} ref={sidebarRef}>
          <button className="close-btn" onClick={() => setIsSidebarClicked(false)} title="Cerrar sidebar"> <FiX /></button>

          <div className="profile-section">
              <img src="https://randomuser.me/api/portraits/men/17.jpg" alt="imagen perfil" className="avatar"/>
              <p className="username">Cristian Rodríguez</p>
          </div>

          <nav className="nav-links">
              <h2 onClick={goToProfile}><FiUser /> Mi perfil</h2>
              <h2 onClick={goToChat}><FiMessageSquare /> Mensajes</h2>
              <h2 onClick={goToHome}><FiClock /> Home</h2>
          </nav>

          <h2 className="log-out" onClick={logOut}>Cerrar Sesión</h2>
      </div>
    );
}

export default TutorSidebar;