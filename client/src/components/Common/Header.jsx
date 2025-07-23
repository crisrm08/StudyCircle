import React, {useContext} from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from 'react-router-dom';
import { FiMenu } from "react-icons/fi";
import { CiLogin } from "react-icons/ci";
import { SidebarContext } from "../../contexts/SidebarContext";
import '../../css/header.css'

function Header() {
  const navigate = useNavigate();
  const { setIsSidebarClicked } = useContext(SidebarContext);
  const { user } = useUser();

  function openSidebar() {
    setIsSidebarClicked(true);
  }

  function goToHome() {
    navigate("/");
  }

  function openLogIn() {
    navigate("/login");
  }

  return (
    <header>
      <h1 onClick={goToHome}>StudyCircle</h1>
       {user ? (
        <button className="logout-btn" title="Open Sidebar" onClick={openSidebar} style={{ position: "relative" }}>
          <FiMenu />
          <span className="notification-dot" />
        </button>
      ) : (
        <button className="login-signup-button logout-btn" title="Log in button" onClick={openLogIn}> Login / SignUp <CiLogin size={35}/> </button>
      )}
    </header>
  );
}

export default Header;
