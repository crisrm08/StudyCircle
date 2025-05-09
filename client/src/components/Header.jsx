import React, {useContext} from "react";
import { FiMenu } from "react-icons/fi";
import { SidebarContext } from "../contexts/SidebarContext";
import '../css/header.css'

function Header() {
  const { setIsSidebarClicked } = useContext(SidebarContext);

  function OpenSidebar() {
    setIsSidebarClicked(true);
  }

  return (
    <header>
      <h1>StudyCircle</h1>
      <button className="logout-btn" title="Open Sidebar" onClick={OpenSidebar}>
        <FiMenu />
      </button>
    </header>
  );
}

export default Header;
