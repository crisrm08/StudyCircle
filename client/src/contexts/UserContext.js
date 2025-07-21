import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { supabase } from "../components/Supabase/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { use } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [imageFilePath, setImageFilePath] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [userStrongTopics, setUserStrongTopics] = useState("");
  const [userWeakTopics, setUserWeakTopics] = useState("");
  const [userTeachedTopics, setUserTeachedTopics] = useState([]);
  const [ocupations, setOcupations] = useState([]);
  const [academicLevels, setAcademicLevels] = useState([]);
  const [userOcupationName, setUserOcupationName] = useState("");
  const [userAcademicLevelName, setUserAcademicLevelName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  

  async function fetchUserProfile(session) {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`,
        {},
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );
      const profile = response.data;

      setUser(profile);
      console.log(profile);

      const topicsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user-topics`,
        { params: { user_id: response.data.user_id } }
      );
      setUserStrongTopics(topicsResponse.data.strong);
      setUserWeakTopics(topicsResponse.data.weak);
      setUserTeachedTopics(topicsResponse.data.teaches); 
                
      return profile;
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
      } else if (profile.suspended) {
        
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
          }
          else if (profile.suspended) {
            
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

  useEffect(() => {
    if (!user) return;

    const filePath = `user_${user.user_id}.jpg`;
    setImageFilePath(filePath);

    const { data } = supabase
      .storage
      .from('profile.images')
      .getPublicUrl(filePath);
    setImageData(data.publicUrl + `?t=${Date.now()}`)

  },[user]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/ocupations-academic-levels`)
      .then(res => {
        setOcupations(res.data.ocupations);
        setAcademicLevels(res.data.academicLevels);
      });
  }, []);

  useEffect(() => {
    if (user && ocupations.length > 0) {
      const name = ocupations.find(o => Number(o.value) === Number(user.occupation))?.label || "";
      setUserOcupationName(name);
    }
    if (user && academicLevels.length > 0) {
      const name = academicLevels.find(a => Number(a.value) === Number(user.academic_level))?.label || "";
      setUserAcademicLevelName(name);
    }
  }, [user, ocupations, academicLevels]);

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      imageFilePath,
      imageData,
      loading,
      userStrongTopics,
      userWeakTopics,
      userTeachedTopics,
      setUserStrongTopics,
      setUserWeakTopics,
      setUserTeachedTopics,
      userOcupationName, 
      userAcademicLevelName
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);