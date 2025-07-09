import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import "./issue.css"
import server from "../../../Environment.js";
const server_url=server;
const CreateIssue=()=>{
    const {id}=useParams();
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [status,setStatus]=useState("Open");
    const [errors, setErrors] = useState({});
    const [isLoading,setIsLoading]=useState(false);
    const navigate=useNavigate();
    const handleCreate=async()=>{
        if(!title){
            alert("Title for the issue is important");
            return;
        }
        try{
            const result=await axios.post(`${server_url}/issue/create/${id}`,{
                title,
                description,
                status,
                repository:id
            });
            if(!result || result.status!==201){
                alert("Error creating issue");
            }
            alert("Issue raised successfully");
            navigate(`/repository/${id}`);
        }catch(err){
            console.log("Error creating issue");
            alert("Issue cant be created");
        }
    }
    return(
   <div className="create-repo-container">
        <div className="repo-card">
          {/* Header */}
          <div className="repo-header">
            <div className="repo-icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
            </div>
            <h1 className="repo-title">Create Issue</h1>
            <p className="repo-subtitle">Add an issue to this repository..</p>
          </div>

          {/* Form */}
          <div className="repo-form">
            {/* Repository Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="repoName">
                Issue Title *
              </label>
              <input
                id="repoName"
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="issue name"
                value={title}
               onChange={(e)=>(setTitle(e.target.value))}
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="repoDesc">
                Description*
              </label>
              <textarea
                id="repoDesc"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="A brief description of your issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {/* Submit Button */}
            <button
              type="button"
              onClick={handleCreate}
              disabled={isLoading || !title.trim() || !description.trim()}
              className="submit-button"
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Creating Issue...</span>
                </>
              ) : (
                <>
                  <span>✓</span>
                  <span>Create Issue</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
    

}
export default CreateIssue;