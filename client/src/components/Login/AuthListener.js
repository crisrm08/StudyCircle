import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Supabase/supabaseClient";

export default function AuthListener() {
  const navigate = useNavigate();

  useEffect(() => {
  const { data: sub } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { data, error } = await supabase
          .from("users")
          .select("profile_type")
          .eq("supabase_user_id", session.user.id)
          .maybeSingle();    // ← Aquí

          if (error) {
            console.error("Error leyendo users:", error);
            return;
          }
          if (!data) {
            // no hay perfil → pick-role
            return navigate("/pick-role");
          }
          // ya existe perfil
          return navigate(
            data.profile_type === "student"
              ? "/student-dashboard"
              : "/tutor-dashboard"
          );
        }
        if (event === "SIGNED_OUT") {
          navigate("/");
        }
      }
    );
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  return null;
}
