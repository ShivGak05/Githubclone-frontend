import React from "react";
import { useAuth } from "../authContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/auth"); // redirect to home or login
  };

  // Optional: Only show button if user is logged in
  if (!currentUser) return null;

  return (
    <div style={{ marginTop: "50px", textAlign: "center" }}>
      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          backgroundColor: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
