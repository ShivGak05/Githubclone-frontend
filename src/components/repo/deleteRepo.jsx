import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DeleteRepo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const deleteRepo = async () => {
      try {
        const result = await axios.delete(`http://localhost:3000/repo/delete/${id}`);
        alert(result.data.message);
        navigate("/"); // or "/" depending on your route
      } catch (error) {
        console.error("Error deleting repo:", error);
      }
    };

    deleteRepo();
  }, [id, navigate]);

  return <p>Deleting repository...</p>; // Optional feedback
};

export default DeleteRepo;
