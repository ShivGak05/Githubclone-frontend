import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./updateRepo.css";
import server from "../../../Environment.js";
const server_url=server;
const UpdateRepo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [repository, setRepository] = useState(null);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [isLoading,setIsLoading]=useState(false);
 useEffect(() => {
    const fetchRepository = async () => {
      try {
        const response = await fetch(`${server_url}/repo/${id}`);
        const data = await response.json();
        console.log(data.repository);
        if(!data.repository){
          alert("Repo not found");
          return navigate(`/repository/${id}`);
        }else{
        setRepository(data.repository);
        setContent(data.repository.content);
        setDescription(data.repository.description);
        }
      } catch (error) {
        console.error("Failed to fetch repository", error);
      }
    };

    fetchRepository();
  }, [id]);

  const handleContentChange = (index, value) => {
  const updated = [...content];
  updated[index] = value;
  setContent(updated);
};

const handleAddContent = () => {
  if (newContent.trim() !== "") {
    setContent([...content, newContent.trim()]);
    setNewContent("");
  }
};


  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const result = await axios.put(`${server_url}/repo/update/${id}`, {
        description,
        content,
      });

      alert(result.data.message || "Repository updated!");
      setIsLoading(false);
      navigate(`/repository/${id}`);
    } catch (err) {
      console.error("Error updating repository:", err);
      alert("Failed to update repository");
    }
  };

  const handleRemoveContent = (index) => {
    const updatedContent = content.filter((_, i) => i !== index);
    setContent(updatedContent);
  };
 useEffect(() => {
  if (repository) {
    setDescription(repository.description || "");
  }
}, [repository]);
if (!repository) {
  return <div className="loading">Loading repository...</div>;
}
 return (
  <div className="update-repo-container">
        <div className="repo-card">
          {/* Header */}
          <div className="repo-header">
            <div className="repo-icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </div>
            <h1 className="repo-title">Update Repository</h1>
          </div>

          <div className="repo-form">
            {/* Repository Name */}
            <div className="form-group">
              <label className="form-label">Repository Name:</label>
              <input 
                type="text" 
                value={repository.name} 
                disabled 
                className="form-input"
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description:</label>
              <textarea
                rows="5"
                placeholder={repository.description}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
              />
            </div>

            {/* Content Section */}
            <div className="content-section">
              <div className="content-title">
                <span>📁</span>
                Content Files
              </div>
              
              {content.length > 0 ? (
                content.map((file, index) => (
                  <div key={index} className="content-item">
                    <div className="content-header">
                      <span className="file-label">
                        <span>📄</span>
                        File {index + 1}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveContent(index)}
                      className="remove-btn"
                      title="Remove file"
                    >
                      ×
                    </button>
                    <textarea
                      rows="4"
                      value={file}
                      onChange={(e) => handleContentChange(index, e.target.value)}
                      placeholder={`File ${index + 1} content...`}
                      className="form-textarea"
                    />
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <p>No content files yet. Add your first file below!</p>
                </div>
              )}
            </div>

            {/* Add New Content */}
            <div className="add-content-section">
              <div className="add-content-title">
                <span>➕</span>
                Add New File
              </div>
              <textarea
                rows="4"
                placeholder="Add new file content..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="form-textarea new-content"
              />
            </div>

            {/* Buttons */}
            <div className="btn-group-of-view-repo">
              <button 
                onClick={handleAddContent}
                className="btn-secondary"
                disabled={!newContent.trim()}
              >
                <span>➕</span>
                Add Content
              </button>
              
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
                    <span>Update Repository</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
);


};

export default UpdateRepo;
