import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import "./issue.css"
const CreateIssue=()=>{
    const {id}=useParams();
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [status,setStatus]=useState("Open");
    const navigate=useNavigate();
    const handleCreate=async()=>{
        if(!title){
            alert("Title for the issue is important");
            return;
        }
        try{
            const result=await axios.post(`13.53.131.133:3000/issue/create/${id}`,{
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
       <div className="issue-form">
        <div className="inside-content">
        <h4 className="issue-create">Create an issue</h4>
        <div class="mb-3">
  <label htmlForfor="title" className="form-label">Issue Title:</label>
  <input type="text" className="form-control" placeholder="title" onChange={(e)=>(setTitle(e.target.value))} value={title}></input>
</div>
<div class="mb-3">
  <label htmlForfor="description" className="form-label">Description</label>
  <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
</div>
<label htmlFor="status" className="form-label">Status</label>
<select className="form-select" aria-label="Default select example" value={status} onChange={(e) => setStatus(e.target.value)}>
  <option selected>Open this select menu</option>
  <option value="open">Open</option>
  <option value="closed">Closed</option>
  </select>
<button className="btn btn-primary" onClick={handleCreate}>Create Issue</button>
    </div>
    </div>
    )
}
export default CreateIssue;