import { useState } from "react";
import { supabase } from "../Supabase/supabaseClient";
import { useNavigate } from "react-router-dom";
import { PiStudent } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import "../../css/loginStyles/pickrolescreen.css";

function PickRoleScreen() {
  const [role, setRole] = useState(null); 
  const navigate = useNavigate();

  async function finishProfile(){
    const {
      data: { session },
    } = await supabase.auth.getSession();

    await supabase.from("users").insert({
      supabase_user_id: session.user.id,
      profile_type: role,
    });

    navigate( role === "estudiante" ? "/edit-student-profile": "/edit-tutor-profile");
  };

  return (
    <div className="pick-role-screen">
      <h1 className="title title-mobile" style={{color:"#163172"}}>StudyCircle</h1>
      <div className="pick-role-content">
        <h2>Selecciona tu rol</h2>
        <div className="options-container">
            <button onClick={() => setRole("estudiante")}>
              <PiStudent size={250}/>
              Estudiante
            </button>
            <button onClick={() => setRole("tutor")}>
              <FaChalkboardTeacher size={200}/>
              Tutor
            </button>
        </div>
        {role && <button onClick={finishProfile}>Continuar como {role}</button>}
      </div>
    </div>
  );
}

export default PickRoleScreen;
