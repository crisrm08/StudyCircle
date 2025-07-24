import React, {useContext} from "react";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from 'react-router-dom';
import { FiMenu } from "react-icons/fi";
import { CiLogin } from "react-icons/ci";
import { SidebarContext } from "../../contexts/SidebarContext";
import { ChatsContext } from '../../contexts/ChatsContext';
import '../../css/header.css'

function Header() {
  const navigate = useNavigate();
  const { setIsSidebarClicked } = useContext(SidebarContext);
  const { user } = useUser();
  const { chats } = useContext(ChatsContext);
  const newMessagesCount = chats.filter(c => c.hasNewMessage).length;
  const pendingRatings = chats.filter(c => c.status === 'finished' && !c.hasRated).length;

  function openSidebar() {
    setIsSidebarClicked(true);
  }

  function goToHome() {
    navigate("/");
  }

  function openLogIn() {
    navigate("/login");
  }

  console.log("new messages count: " + newMessagesCount);
  console.log("Pending Ratings: " + pendingRatings);

  return (
    <header>
      <h1 onClick={goToHome}>StudyCircle</h1>
       {user ? (
        <button style={{ position: 'relative' }} onClick={openSidebar}>
          <FiMenu />
          {(newMessagesCount > 0 || pendingRatings > 0) && (
            <span className="notification-dot" />
          )}
        </button>
      ) : (
        <button className="login-signup-button logout-btn" title="Log in button" onClick={openLogIn}> Login / SignUp <CiLogin size={35}/> </button>
      )}
    </header>
  );
}

export default Header;
