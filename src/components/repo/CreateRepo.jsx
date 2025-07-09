import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GitBranch, Lock, Globe, Check, AlertCircle } from "lucide-react";
import "./CreateRepo.css";
import server from "../../../Environment.js";
const server_url=server;
const CreateRepo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState([]);
  const [visibility, setVisibility] = useState("public");
  const [owner, setOwner] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const user = localStorage.getItem("userId");
     console.log("Fetched user ID from localStorage:", user); // Add this
    setOwner(user);
  }, []);

    const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = "Repository name is required";
    } else if (name.length < 3) {
      newErrors.name = "Repository name must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
      newErrors.name = "Repository name can only contain letters, numbers, dots, hyphens, and underscores";
    }

    if (description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!owner) {
  alert("User ID not loaded. Please refresh.");
  return;
}
setIsLoading(true);
    try {
      const visibilityboolean=visibility==="public";
     console.log("Creating repo with:", {
  name,
  description,
  content,
  visibility: visibility === "public", // convert to boolean
  owner,
});

      const result = await axios.post(`${server_url}/repo/create`, {
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
    }finally{
      setIsLoading(false);
    }
  };
    const handleNameChange = (e) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors({ ...errors, name: "" });
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    if (errors.description) {
      setErrors({ ...errors, description: "" });
    }
  };

  return (
      <div className="create-repo-container">
        <div className="repo-card">
          {/* Header */}
          <div className="repo-header">
            <div className="repo-icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </div>
            <h1 className="repo-title">Create Repository</h1>
            <p className="repo-subtitle">Start your new project with a fresh repository</p>
          </div>

          {/* Form */}
          <div className="repo-form">
            {/* Repository Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="repoName">
                Repository Name *
              </label>
              <input
                id="repoName"
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="my-awesome-project"
                value={name}
                onChange={handleNameChange}
              />
              {errors.name && (
                <div className="error-message">
                  <span>⚠️</span>
                  {errors.name}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="repoDesc">
                Description (optional)
              </label>
              <textarea
                id="repoDesc"
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="A brief description of your project..."
                value={description}
                onChange={handleDescriptionChange}
              />
              {errors.description && (
                <div className="error-message">
                  <span>⚠️</span>
                  {errors.description}
                </div>
              )}
              <div className={`char-counter ${description.length > 450 ? 'warning' : ''}`}>
                {description.length}/500
              </div>
            </div>

            {/* Visibility */}
            <div className="visibility-section">
              <h3 className="visibility-title">Repository Visibility</h3>
              <div className="visibility-options">
                {/* Public Option */}
                <div 
                  className={`visibility-option ${visibility === "public" ? 'selected' : ''}`}
                  onClick={() => setVisibility("public")}
                >
                  <div className="visibility-header">
                    <svg className="visibility-icon" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span className="visibility-name">Public</span>
                  </div>
                  <p className="visibility-description">
                    Anyone on the internet can see this repository. You choose who can commit.
                  </p>
                </div>

                {/* Private Option */}
                <div 
                  className={`visibility-option ${visibility === "private" ? 'selected' : ''}`}
                  onClick={() => setVisibility("private")}
                >
                  <div className="visibility-header">
                    <svg className="visibility-icon" viewBox="0 0 24 24">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                    <span className="visibility-name">Private</span>
                  </div>
                  <p className="visibility-description">
                    You choose who can see and commit to this repository.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleCreate}
              disabled={isLoading || !name.trim()}
              className="submit-button"
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Creating Repository...</span>
                </>
              ) : (
                <>
                  <span>✓</span>
                  <span>Create Repository</span>
                </>
              )}
            </button>

            {/* Footer */}
            <div className="footer-text">
              By creating a repository, you agree to our terms of service and privacy policy.
            </div>
          </div>
        </div>
      </div>

  );
};

export default CreateRepo;
