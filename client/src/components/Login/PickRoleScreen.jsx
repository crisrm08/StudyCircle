import { useState } from "react";
import { supabase } from "../Supabase/supabaseClient";
import { PiStudent } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import LoadingScreen from "../Common/LoadingScreen";
import "../../css/loginStyles/pickrolescreen.css";

function PickRoleScreen() {
  const [role, setRole] = useState(null); 
  const navigate = useNavigate();
  const { loading } = useUser();
  if (loading) return <LoadingScreen/>

  async function finishProfile() {
    const { data: { session } } = await supabase.auth.getSession();

    const { data: existing, error: selectError } = await supabase
      .from("users")
      .select("id")
      .eq("supabase_user_id", session.user.id)
      .maybeSingle();

    if (!existing) {
      const { error: insertError } = await supabase.from("users").insert({
        supabase_user_id: session.user.id,
        profile_type: role,
        email: session.user.email, 
      });
      if (insertError) {
        alert("Error creando perfil: " + insertError.message);
        return;
      }
    }

    if (role === "student") {
      navigate("/edit-student-profile");
    } else {
      navigate("/edit-tutor-profile");
    }
  }
  return (
    <div className="pick-role-screen">
      <h1 className="title title-mobile" style={{color:"#163172"}}>StudyCircle</h1>
      <div className="pick-role-content">
        <h2>Selecciona tu rol</h2>
        <div className="options-container">
            <button onClick={() => setRole("student")}>
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
