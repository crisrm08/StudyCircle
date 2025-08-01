import React, { useContext, useEffect, useRef } from "react";
import { supabase } from "../Supabase/supabaseClient";
import { useUser } from "../../contexts/UserContext";
import { FiUser, FiMessageSquare, FiHome, FiX, FiSettings } from "react-icons/fi";
import { MdOutlinePayment } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import '../../css/sidebar.css';
import { SidebarContext } from "../../contexts/SidebarContext";
import { ChatsContext } from "../../contexts/ChatsContext";

function TutorSidebar() {
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const sidebarRef = useRef();
    const { user } = useUser();
    const { chats } = useContext(ChatsContext);
    const newMessagesCount = chats.filter(c => c.hasNewMessage).length;
    const pendingRatings = chats.filter(c => c.status === 'finished' && !c.hasRated).length;
    const { imageData } = useUser();
    const { loading } = useUser();
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
      navigate("/tutor-profile");
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

    if (loading || !user) return null;

    return (
      <div className={`sidebar ${isSidebarClicked ? "open" : ""}`} ref={sidebarRef}>
          <button className="close-btn" onClick={() => setIsSidebarClicked(false)} title="Cerrar sidebar"> <FiX /></button>

          <div className="profile-section">
              <img src={imageData} alt="imagen perfil" className="avatar"/>
              <p className="username">{user.name} {user.last_name}</p>
          </div>

          <nav className="nav-links">
              <h2 onClick={goToHome}><FiHome /> Home</h2>
              <h2 onClick={goToProfile}><FiUser /> Mi perfil</h2>
              <h2 onClick={goToChat} style={{ position: 'relative' }}>
                <FiMessageSquare /> Chat
                {(newMessagesCount > 0 || pendingRatings > 0) && <span className="notification-dot" />}
              </h2>
              <h2 onClick={goToSettings}><FiSettings /> Ajustes</h2>
              <h2 onClick={goToPaymentSettings}><MdOutlinePayment/>Cobro</h2>
          </nav>

          <h2 className="log-out" onClick={logOut}>Cerrar Sesión</h2>
      </div>
    );
}

export default TutorSidebar;