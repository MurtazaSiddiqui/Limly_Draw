import React from "react";
import PresenceAvatars from "../Comonents/PresenceAvatars.jsx";
import RoomProviderWrapper from "../Comonents/RoomProviderWrapper.jsx";
import ChatPanel from "../Comonents/ChatPanel.jsx";
import ActiveUsersCounter from "../Comonents/ActiveUsersCounter.jsx";
import Canvas from "../comonents/Canvas";
import Toolbar from "../Comonents/Toolbar.jsx";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";


export default function Dashboard() {
    const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // sign out user
      navigate("/login"); // redirect to login
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <>
    <button className="btn btn-dark" onClick={()=> handleLogout()} >Logout</button>
    <RoomProviderWrapper roomId="drawing-room">
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <Toolbar />
          <Canvas />
        </div>
        <div>
          <PresenceAvatars />
          <ActiveUsersCounter />
          <ChatPanel />
        </div>
      </div>
    </RoomProviderWrapper>
    </>
  );
}
