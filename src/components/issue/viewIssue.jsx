import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./issue.css";
import server from "../../../Environment.js";

const server_url = server;

const ViewIssue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findIssue = async () => {
      try {
        const result = await fetch(`${server_url}/issue/${id}`);
        const data = await result.json();
        if (!data.issue) {
          alert("No issue found");
          navigate("/");
        } else {
          setIssue(data.issue);
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching issue");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    findIssue();
  }, [id, navigate]);

  const handleIssueDelete = () => {
    navigate(`/issue/delete/${issue._id}`);
  };

  const handleUpdateIssue = () => {
    navigate(`/issue/update/${issue._id}`);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "status-open";
      case "closed":
        return "status-closed";
      case "in-progress":
        return "status-progress";
      default:
        return "status-open";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
      case "closed":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
      case "in-progress":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
    }
  };

  if (loading) return <div className="loading">Loading issue...</div>;
  if (!issue) return null; // fallback if issue is null

  return (
    <div className="issue-card-container">
      <div className="issue-card-header">
        <div className="issue-title-section">
          <h2 className="issue-title">{issue.title}</h2>
          <div className={`issue-status-badge ${getStatusColor(issue.status)}`}>
            {getStatusIcon(issue.status)}
            <span className="status-text">{issue.status || "Open"}</span>
          </div>
        </div>
      </div>

      <div className="issue-card-body">
        <div className="issue-description-section">
          <h3 className="section-title">
            Description
          </h3>
          <div className="issue-description">
            {issue.description ? (
              <p>{issue.description}</p>
            ) : (
              <p className="no-description">No description provided</p>
            )}
          </div>
        </div>

        {/* <div className="issue-metadata">
          {issue.createdAt && (
            <div className="metadata-item">
              <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
          )}
          {issue.author && (
            <div className="metadata-item">
              <span>Author: {issue.author.username || issue.author.name || "Unknown"}</span>
            </div>
          )}
          {issue.updatedAt && issue.updatedAt !== issue.createdAt && (
            <div className="metadata-item">
              <span>Updated: {new Date(issue.updatedAt).toLocaleDateString()}</span>
            </div>
          )}
        </div> */}
      </div>

      <div className="issue-card-actions">
        <button className="btn btn-update" onClick={handleUpdateIssue}>
          Update
        </button>
        <button className="btn btn-delete" onClick={handleIssueDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ViewIssue;
