import React, { useContext } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { ScreenContext } from "../contexts/ScreenContext";
import '../css/header.css'

function Header() {

  const { setCurrentScreen } = useContext(ScreenContext)

  function logOut() {
    setCurrentScreen("Login");
  }

  return (
    <header>
      <h1>StudyCircle</h1>
      <button className="logout-btn" title="Cerrar sesión" onClick={logOut}>
        <FaSignOutAlt />
      </button>
    </header>
  );
}

export default Header;
