import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./issue.css";
import server from "../../../Environment.js";

const server_url = server;

const UpdateIssue = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");
  const [issue, setIssue] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const result = await fetch(`${server_url}/issue/${id}`);
        const data = await result.json();
        if (!data.issue) {
          alert("Issue not found");
          return navigate(`/issues`);
        } else {
          setIssue(data.issue);
          setTitle(data.issue.title);
          setDescription(data.issue.description);
          setStatus(data.issue.status);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load issue.");
        navigate(`/issues`);
      }
    };
    fetchIssue();
  }, [id, navigate]);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const result = await axios.put(`${server_url}/issue/update/${id}`, {
        title,
        description,
        status,
      });
      alert(result.data.message || "Issue updated successfully!");
      navigate(`/issue/${id}`);
    } catch (err) {
      console.error(err);
      alert("Error updating issue.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      {!issue ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading issue...</p>
        </div>
      ) : (
        <div className="update-repo-container">
          <div className="repo-card">
            <div className="repo-header">
              <div className="repo-icon">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </div>
              <h1 className="repo-title">Update Issue</h1>
            </div>

            <div className="repo-form">
              <div className="form-group">
                <label className="form-label">Issue Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description:</label>
                <textarea
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status:</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="btn-group-of-view-repo">
                <button
                  onClick={handleUpdate}
                  className="btn-primary2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>Update Issue</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateIssue;
