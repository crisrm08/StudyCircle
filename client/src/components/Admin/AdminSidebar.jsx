import React, { useContext, useEffect, useRef } from "react";
import { supabase } from "../Supabase/supabaseClient";
import {  FiX } from "react-icons/fi";
import { useUser } from "../../contexts/UserContext";
import '../../css/sidebar.css';
import { SidebarContext } from "../../contexts/SidebarContext";

function AdminSidebar() {
    const { isSidebarClicked, setIsSidebarClicked } = useContext(SidebarContext);
    const { user } = useUser();
    const { loading } = useUser();
    const sidebarRef = useRef();
  

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

    if (loading || !user) return null;

    return (
      <div className={`sidebar ${isSidebarClicked ? "open" : ""}`} ref={sidebarRef}>
          <button className="close-btn" onClick={() => setIsSidebarClicked(false)} title="Cerrar sidebar"> <FiX /></button>

          <div className="profile-section">
              <img src={"https://www.shutterstock.com/image-vector/user-icon-trendy-flat-style-600nw-418179856.jpg"} alt="imagen perfil" className="avatar"/>
              <p className="username">Admin</p>
          </div>

          <h2 className="log-out" onClick={logOut}>Cerrar Sesión</h2>
      </div>
    );
}

export default AdminSidebar;