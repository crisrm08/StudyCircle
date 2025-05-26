import React, {useContext} from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { FiMenu } from "react-icons/fi";
import { CiLogin } from "react-icons/ci";
import { SidebarContext } from "../../contexts/SidebarContext";
import '../../css/header.css'

function Header() {
  const navigate = useNavigate();
  const { setIsSidebarClicked } = useContext(SidebarContext);
  const { isLoggedIn } = useContext(AuthContext)

  function openSidebar() {
    setIsSidebarClicked(true);
  }

  function openLogIn() {
    navigate("/login");
  }

  return (
    <header>
      <h1>StudyCircle</h1>
      {isLoggedIn === false ? (
        <button className="login-signup-button logout-btn" title="Log in button" onClick={openLogIn}> Login / SignUp <CiLogin  size={35}/> </button>
      ) : (
        <button className="logout-btn" title="Open Sidebar" onClick={openSidebar}> <FiMenu /> </button>
      )}
    
    </header>
  );
}

export default Header;
