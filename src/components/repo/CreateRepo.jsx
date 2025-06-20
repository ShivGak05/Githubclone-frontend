import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateRepo.css";

const CreateRepo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState([]);
  const [visibility, setVisibility] = useState("public");
  const [owner, setOwner] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("userId");
     console.log("Fetched user ID from localStorage:", user); // Add this
    setOwner(user);
  }, []);

  const handleCreate = async () => {
    if (!owner) {
  alert("User ID not loaded. Please refresh.");
  return;
}
    try {
      const visibilityboolean=visibility==="public";
     console.log("Creating repo with:", {
  name,
  description,
  content,
  visibility: visibility === "public", // convert to boolean
  owner,
});

      const result = await axios.post("13.53.131.133:3000/repo/create", {
        name,
        description,
        content,
        visibility:visibilityboolean,
        owner,
      });

      if (!result || result.status !== 201) {
        alert("Repository not created");
        return;
      }

      alert("Repository created successfully");
      navigate("/");
    } catch (err) {
      console.error("Error creating repository:", err);
      alert("Error occurred while creating repository.");
    }
  };

  return (
   <div className="container mt-4">
  <div className="card shadow">
    <div className="card-body">
      <h2 className="card-title mb-4">Create a Repository</h2>

      <div className="mb-3">
        <label htmlFor="repoName" className="form-label">Repository Name:</label>
        <input
          id="repoName"
          type="text"
          className="form-control"
          placeholder="Repository Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="repoDesc" className="form-label">Description:</label>
        <textarea
          id="repoDesc"
          className="form-control"
          placeholder="Repository Description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">Visibility:</h5>

        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="radio"
            name="visibility"
            id="visibilityPrivate"
            value="private"
            checked={visibility === "private"}
            onChange={() => setVisibility("private")}
          />
          <label className="form-check-label" htmlFor="visibilityPrivate">
            <strong>Private</strong><br />
            <small className="text-muted">You choose who can see and commit to this repository.</small>
          </label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="visibility"
            id="visibilityPublic"
            value="public"
            checked={visibility === "public"}
            onChange={() => setVisibility("public")}
          />
          <label className="form-check-label" htmlFor="visibilityPublic">
            <strong>Public</strong><br />
            <small className="text-muted">Anyone on the internet can see this repository. You choose who can commit.</small>
          </label>
        </div>
      </div>

      <div className="d-grid">
        <button className="btn btn-primary" onClick={handleCreate}>
          Create Repository
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default CreateRepo;
