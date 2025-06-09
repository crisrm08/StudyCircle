import React, { useContext, useEffect, useRef } from "react";
import { FiUser, FiMessageSquare, FiClock, FiX, FiHome, FiSettings } from "react-icons/fi";
import { MdOutlinePayment } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import '../../css/sidebar.css';
import { SidebarContext } from "../../contexts/SidebarContext";

function StudentSidebar() {
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
      navigate("/student-profile");
      setIsSidebarClicked(false);
    }

    function goToSettings() {
      navigate("/edit-student-profile");
      setIsSidebarClicked(false);
    }

    function goToHistory() {
      navigate("/student-history");
      setIsSidebarClicked(false);
    }

    function goToHome() {
      navigate("/");
      setIsSidebarClicked(false);
    }

    function goToPaymentSettings() {
      navigate("/payment-method");
      setIsSidebarClicked(false);
    }

    return (
      <div className={`sidebar ${isSidebarClicked ? "open" : ""}`} ref={sidebarRef}>
          <button className="close-btn" onClick={() => setIsSidebarClicked(false)} title="Cerrar sidebar"> <FiX /></button>

          <div className="profile-section">
              <img src="https://randomuser.me/api/portraits/men/12.jpg" alt="imagen perfil" className="avatar"/>
              <p className="username">Elvis García</p>
          </div>

          <nav className="nav-links">
              <h2 onClick={goToHome}><FiHome />Home</h2>
              <h2 onClick={goToProfile}><FiUser /> Mi perfil</h2>
              <h2 onClick={goToChat}><FiMessageSquare /> Mensajes</h2>
              <h2 onClick={goToSettings}> <FiSettings /> Ajustes</h2>
              <h2 onClick={goToHistory}><FiClock /> Historial</h2>
              <h2 onClick={goToPaymentSettings}><MdOutlinePayment /> Métodos de pago</h2>
          </nav>

          <h2 className="log-out" onClick={logOut}>Cerrar Sesión</h2>
      </div>
    );
}

export default StudentSidebar;