import React, { useContext, useEffect, useRef } from "react";
import { supabase } from "../Supabase/supabaseClient";
import { FiUser, FiMessageSquare, FiClock, FiX, FiHome, FiSettings, FiSearch } from "react-icons/fi";
import { MdOutlinePayment } from "react-icons/md";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import '../../css/sidebar.css';
import { SidebarContext } from "../../contexts/SidebarContext";

function StudentSidebar() {
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const { user } = useUser();
    const { imageData } = useUser();
    const { loading } = useUser();
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

    if (loading || !user) return null;

    return (
      <div className={`sidebar ${isSidebarClicked ? "open" : ""}`} ref={sidebarRef}>
          <button className="close-btn" onClick={() => setIsSidebarClicked(false)} title="Cerrar sidebar"> <FiX /></button>

          <div className="profile-section">
              <img src={imageData} alt="imagen perfil" className="avatar"/>
              <p className="username">{user.name} {user.last_name}</p>
          </div>

          <nav className="nav-links">
              <h2 onClick={goToHome}><FiSearch /> Búsqueda</h2>
              <h2 onClick={goToProfile}><FiUser /> Mi perfil</h2>
              <h2 onClick={goToChat}><FiMessageSquare /> Chat</h2>
              <h2 onClick={goToSettings}> <FiSettings /> Ajustes</h2>
              <h2 onClick={goToHistory}><FiClock /> Historial</h2>
              <h2 onClick={goToPaymentSettings}><MdOutlinePayment /> Métodos de pago</h2>
          </nav>

          <h2 className="log-out" onClick={logOut}>Cerrar Sesión</h2>
      </div>
    );
}

export default StudentSidebar;