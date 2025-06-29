import React, { useContext, useEffect, useRef } from "react";
import { supabase } from "../Supabase/supabaseClient";
import { FiUser, FiMessageSquare, FiHome, FiX, FiSettings } from "react-icons/fi";
import { MdOutlinePayment } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import '../../css/sidebar.css';
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

    async function logOut() {
      await supabase.auth.signOut();
      setIsSidebarClicked(false);
    }

    function goToChat() {
      navigate("/chat");
      setIsSidebarClicked(false);
    }

    function goToProfile() {
      navigate("/tutor-info");
      setIsSidebarClicked(false);
    }

    function goToSettings() {
      navigate("/edit-tutor-profile");
      setIsSidebarClicked(false);
    }

    function goToHome() {
      navigate("/tutor-home-page")
      setIsSidebarClicked(false);
    }

    function goToPaymentSettings() {
      navigate("/tutor-payment-settings");
      setIsSidebarClicked(false);
    }

    return (
      <div className={`sidebar ${isSidebarClicked ? "open" : ""}`} ref={sidebarRef}>
          <button className="close-btn" onClick={() => setIsSidebarClicked(false)} title="Cerrar sidebar"> <FiX /></button>

          <div className="profile-section">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="imagen perfil" className="avatar"/>
              <p className="username">Carlos Santana</p>
          </div>

          <nav className="nav-links">
              <h2 onClick={goToProfile}><FiUser /> Mi perfil</h2>
              <h2 onClick={goToChat}><FiMessageSquare /> Mensajes</h2>
              <h2 onClick={goToSettings}><FiSettings /> Ajustes</h2>
              <h2 onClick={goToHome}><FiHome /> Home</h2>
              <h2 onClick={goToPaymentSettings}><MdOutlinePayment/>Cobro</h2>
          </nav>

          <h2 className="log-out" onClick={logOut}>Cerrar Sesión</h2>
      </div>
    );
}

export default TutorSidebar;