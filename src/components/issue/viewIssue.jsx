import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./issue.css";
const ViewIssue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findIssue = async () => {
      try {
        const result = await fetch(`13.53.131.133:3000/issue/${id}`);
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

  if (loading) return <div>Loading issue...</div>;
  if (!issue) return null; // fallback if issue not set even after loading

  return (
    <div className="card card2">
  <div className="card-body">
    <h5 className="card-title">{issue.title}</h5>
    
  </div>
  <p className="card-text">{issue.description}</p>
   {issue.status==="open"?(<span className="badge text-bg-success">{issue.status}</span>):(<span className="badge text-bg-warning">{issue.status}</span>)}
  <div className="btn-group-of-view-repo">
   <button className="btn btn-danger"onClick={handleIssueDelete}>Delete Issue</button>
    <button className="btn btn-primary" onClick={handleUpdateIssue}>Update</button>
    </div>
</div>
  );
};

export default ViewIssue;
