import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../Supabase/supabaseClient";

export default function AuthListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const sbUser = session.user;

          // 1) Comprueba si ya tienes este supabase_user_id en tu tabla "users"
          const { data, error } = await supabase
            .from("users")
            .select("profile_type")
            .eq("supabase_user_id", sbUser.id)
            .single();

          if (error || !data) {
            // 2) No existe → paso de elección de rol
            navigate("/pick-role");
          } else {
            // 3) Ya existe → redirige a su dashboard según profile_type
            if (data.profile_type === "student") {
              navigate("/");
            } else {
              navigate("/tutor-home-page");
            }
          }
        }

        if (event === "SIGNED_OUT") {
          // Opcional: envía al login si hace sign out
          navigate("/login");
        }
      }
    );

    // Cleanup al desmontar
    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [navigate]);

  // Este componente no renderiza nada visible
  return null;
}
