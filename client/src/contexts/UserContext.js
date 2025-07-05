import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { supabase } from "../components/Supabase/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { use } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userStrongTopics, setUserStrongTopics] = useState("");
  const [userWeakTopics, setUserWeakTopics] = useState("");
  const [userTeachedTopics, setUserTeachedTopics] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  async function fetchUserProfile(session) {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`,
        {},
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
      setUser(response.data);
      console.log(response.data);

      const topicsResponse = await axios.get("http://localhost:5000/user-topics",
        { params: { user_id: response.data.user_id } }
      );
      setUserStrongTopics(topicsResponse.data.strong);
      setUserWeakTopics(topicsResponse.data.weak);
      setUserTeachedTopics(topicsResponse.data.teaches); 
                
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setUser(null); 
        return null;
      }
      if (err.response && err.response.status === 401) {
        await supabase.auth.signOut();
        setUser(null);
        return null;
      }
      console.error(err);
      setUser(null);
      return null;
    }
  }

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }
      const profile = await fetchUserProfile(session);
      if (!ignore) setLoading(false);

      if (!profile) {
        if (location.pathname !== "/pick-role") { navigate("/pick-role")}
      } else {
        const editProfileRoutes = ["/edit-tutor-profile", "/edit-student-profile"];
        if (
          ["/login", "/student-signup-3", "/tutor-signup-3", "/pick-role"].includes(location.pathname)
          && !editProfileRoutes.includes(location.pathname)
        ) {
          if (profile.profile_type === "student") {
            navigate("/");
          } else {
            navigate("/tutor-home-page");
          }
        }
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {

          const entryPages = [
            "/login",
            "/student-signup-3",
            "/tutor-signup-3",
            "/pick-role",
          ];
          
          if (!entryPages.includes(location.pathname)) {
            return;  
          }

          setLoading(true);
          const profile = await fetchUserProfile(session);
          setLoading(false);

          if (!profile) {
            navigate("/pick-role");
          } else if (profile.profile_type === "student") {
            navigate("/");
          } else {
            navigate("/tutor-home-page");
          }
        }

        if (event === "SIGNED_OUT") {
          setUser(null);
          setLoading(false);
          navigate("/login");
        }
      }
    );


    return () => {
      ignore = true;
      sub.subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      loading,
      userStrongTopics,
      userWeakTopics,
      userTeachedTopics,
      setUserStrongTopics,
      setUserWeakTopics,
      setUserTeachedTopics
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);