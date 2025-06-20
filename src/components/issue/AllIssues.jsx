import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
const AllIssues=()=>{
    const {id}=useParams();
    const navigate=useNavigate();
    const [Issues,setIssues]=useState([]);
    useEffect(()=>{
        const viewallissues=async()=>{
            try{
                const result=await fetch(`13.53.131.133:3000/issue/repo/${id}`);
                const data=await result.json();
                if(!data){
                    alert("NO issues for this repo");
                    navigate(`/repository/${id}`);
                }
                setIssues(data.issues);
            }catch(err){
                console.log(err);
                alert("Error finding issues for this repository");
            }
        }
        viewallissues();
    },[id,navigate]);
    return (
  <div className="container mt-4">
    <h3 className="mt-2 heading">All Issues for this Repository</h3>
    
    <ul className="list-group">
      {Issues.map((issue) => (
        <li key={issue._id} className="list-group-item d-flex justify-content-between align-items-center yoyo">
          <div>
            <h5 className="mb-1">{issue.title}</h5>
          </div>
          <button 
            className="btn btn-warning btn-sm"
            onClick={() => navigate(`/issue/${issue._id}`)}
          >
            View Issue
          </button>
        </li>
      ))}
    </ul>
  </div>
);

};
export default AllIssues;