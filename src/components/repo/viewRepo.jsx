import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./repo.css"
import server from "../../../Environment";
//import { useLocation } from "react-router-dom";
//const location=useLocation();
const server_url=server;
const RepositoryView = () => {
  const { id } = useParams();
  const [repository, setRepository] = useState(null);
  const navigate=useNavigate();
  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const response = await fetch(`${server_url}/repo/${id}`);
        const data = await response.json();
        console.log(data.repository);
        setRepository(data.repository);
      } catch (error) {
        console.error("Failed to fetch repository", error);
      }
    };

    fetchRepository();
  }, [id]);

  if (!repository) return <p>Loading...</p>;
  const handleUpdate=()=>{
    if(localStorage.getItem("userId")!==repository.owner._id){
        alert("You dont have access to update this repository!");
        return;
    }
    navigate(`/repository/update/${repository._id}`);
  }
  const handleDelete=()=>{
    if(localStorage.getItem("userId")!==repository.owner._id){
        alert("You dont have access to delete this repository!");
        return;
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this repository?");
  if (!confirmDelete) return;

    navigate(`/repository/delete/${repository._id}`);
  }
  const handleToggle=()=>{
    if(localStorage.getItem("userId")!==repository.owner._id){
        alert("You dont have access to toggle visibility of this repository!");
        return;
    }

    navigate(`/repository/toggle/${repository._id}`);
  }
 return (
  <div className="repository-container">
    <div className="repository-card">
      {/* Header Section */}
      <div className="repository-header">
        <div className="repository-title-section">
          <div className="repository-title-row">
            <div className="repository-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 3v12l4-2 4 2V3"/>
              </svg>
            </div>
            <h1 className="repository-title">{repository.name}</h1>
            <span className="visibility-badge">
              {repository.isPublic ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              )}
              {repository.isPublic ? "Public" : "Private"}
            </span>
          </div>
          <div className="repository-owner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>@{repository?.owner?.username || "unknown"}</span>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="repository-description">
        <p>{repository.description}</p>
      </div>

      {/* Content Section */}
      <div className="repository-content">
        <div className="content-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
          <h3>Repository Content</h3>
        </div>
        
        {Array.isArray(repository.content) && repository.content.length > 0 ? (
          <div className="files-container">
            {repository.content.map((file, index) => (
              <div key={index} className="file-card">
                <div className="file-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                  <span className="file-name">File {index + 1}</span>
                </div>
                <pre className="file-content">{file}</pre>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-content">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <p>No content available</p>
          </div>
        )}
      </div>

      {/* Actions Section */}
      <div className="repository-actions">
        <div className="action-grid">
          <button className="btn btn-danger" onClick={handleDelete}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Delete
          </button>
          
          <button className="btn btn-primary" onClick={handleUpdate}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Update
          </button>
          
          <button className="btn btn-warning" onClick={handleToggle}>
            {repository.isPublic ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
            Toggle Visibility
          </button>
          
          <button className="btn btn-success" onClick={() => navigate(`/issue/repo/${repository._id}`)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            View Issues
          </button>
          
          <button className="btn btn-secondary" onClick={() => navigate(`/issue/create/${repository._id}`)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create Issue
          </button>
        </div>
      </div>
    </div>
  </div>
);

};

export default RepositoryView;
