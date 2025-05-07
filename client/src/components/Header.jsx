import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import '../css/header.css'

function Header() {
  const navigate = useNavigate();

  function logOut() {
    navigate("/login");
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
