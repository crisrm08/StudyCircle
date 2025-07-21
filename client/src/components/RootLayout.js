import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { supabase } from "../components/Supabase/supabaseClient";
import SuspendedModal from "./Common/SuspendedModal";

export default function RootLayout() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      {user?.suspended && (
        <SuspendedModal onLogout={handleLogout} />
      )}
      <Outlet />
    </>
  );
}