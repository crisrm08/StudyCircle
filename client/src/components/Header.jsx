import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import '../css/header.css'

function Header() {
  return (
    <header>
      <h1>StudyCircle</h1>
      <button className="logout-btn" title="Cerrar sesión">
        <FaSignOutAlt />
      </button>
    </header>
  );
}

export default Header;
