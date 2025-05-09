import React, { useContext, useEffect, useRef } from "react";
import { FiUser, FiMessageSquare, FiClock, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import '../css/sidebar.css';
import { SidebarContext } from "../contexts/SidebarContext";

function Sidebar() {
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

    function goToChat(params) {
      navigate("/chat");
      setIsSidebarClicked(false);
    }

    return (
      <div className={`sidebar ${isSidebarClicked ? "open" : ""}`} ref={sidebarRef}>
          <button className="close-btn" onClick={() => setIsSidebarClicked(false)} title="Cerrar sidebar"> <FiX /></button>

          <div className="profile-section">
              <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="imagen perfil" className="avatar"/>
              <p className="username">Cristian Rodríguez</p>
          </div>

          <nav className="nav-links">
              <h2><FiUser /> Mi perfil</h2>
              <h2 onClick={goToChat}><FiMessageSquare /> Mensajes</h2>
              <h2><FiClock /> Historial</h2>
          </nav>

          <h2 className="log-out" onClick={logOut}>Cerrar Sesión</h2>
      </div>
    );
}

export default Sidebar;