import React,{useEffect,useState} from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";
import "./issue.css"
import server from "../../../Environment.js";
const server_url=server;
const UpdateIssue=()=>{
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [status,setStatus]=useState("open");
    const [issue,setIssue]=useState(null);
    const navigate=useNavigate();
    const {id}=useParams();
    useEffect(()=>{
        const fetchissue=async()=>{
            try{
            const result=await fetch(`${server_url}/issue/${id}`);
            const data=await result.json();
            if(!data.issue){
                alert("error");
                return navigate(`/issue/${id}`);
            }else{
            setIssue(data.issue);
            setTitle(data.issue.title);
            setDescription(data.issue.description);
            setStatus(data.issue.status);
            }
        }catch(err){
            console.log(err);
        }
        }
        fetchissue();
    },[id]);
    
    const handleupdate=async()=>{
        try{
           let result=await axios.put(`${server_url}/issue/update/${id}`,{
            title,
            description,
            status,
           })
           alert(result.data.message || "Issue updated");
           navigate(`/issue/${id}`);
        }catch(err){
            console.log(err);
            alert("Error updating");
        }
    }
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
    <div className="card shadow-lg">
      <div className="card-body">
        <h3 className="card-title mb-4 myheading">Update Issue</h3>
        
        <form>
          {/* Title Input */}
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Issue Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              placeholder={issue.title}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description Textarea */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              rows="5"
              placeholder={issue.description}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Status Dropdown */}
          <div className="mb-3">
            <label htmlFor="status" className="form-label">Status</label>
            <div className="d-flex align-items-center gap-3">
              <h6 className="mb-0 text-muted">Current: <span className="badge bg-info text-dark">{issue.status}</span></h6>
              <select
                className="form-select w-auto"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="d-grid mt-4">
            <button type="button" className="btn btn-primary btn-lg" onClick={handleupdate}>
              Update Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>

);

}
export default UpdateIssue;