import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import server from "../../../Environment.js";
const server_url=server;
const DeleteUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const deleteUser = async () => {
      const confirmDelete = window.confirm("Do you really want to delete this profile?");
      if (!confirmDelete) {
        navigate(`/user/${id}`);
        return;
      }

      try {
        const response = await fetch(`${server_url}/user/delete/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Error deleting user");
          navigate(`/user/${id}`);
          return;
        }

        alert(data.message || "User deleted successfully");
        navigate("/"); // Redirect to homepage or users list
      } catch (error) {
        console.error("Delete failed:", error);
        alert("An error occurred while deleting the user.");
        navigate(`/user/${id}`);
      }
    };

    deleteUser();
  }, [id, navigate]);

  return <p>Deleting user...</p>; // Optional: UX improvement
};

export default DeleteUser;
