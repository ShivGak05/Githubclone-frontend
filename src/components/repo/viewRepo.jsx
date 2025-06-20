import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./repo.css"
const RepositoryView = () => {
  const { id } = useParams();
  const [repository, setRepository] = useState(null);
  const navigate=useNavigate();
  useEffect(() => {
    const fetchRepository = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/${id}`);
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
//-------------------------------bootstrap---------------------------//
<div className="card">
  <div className="card-body">
    <h5 className="card-title">{repository.name}</h5>
    
  </div>
  <p className="card-text">{repository.description}</p>
  <h4>Content:</h4>
    {Array.isArray(repository.content) && repository.content.length > 0 ? (
      repository.content.map((file, index) => (
        <div key={index} style={{ border: "1px solid #ccc", padding: "8px", marginBottom: "10px" }}>
          <strong>File {index + 1}</strong>
          <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{file}</pre>
        </div>
      ))
    ) : (
      <p>No content available.</p>
    )}
   <p className="card-text">Owner: <b>@{repository?.owner?.username || "unknown"}</b></p>
  <div className="btn-group-of-view-repo">
   <button className="btn btn-danger"onClick={handleDelete}>Delete Repository</button>
    <button className="btn btn-primary" onClick={handleUpdate}>Update Repository</button>
    <button className="btn btn-warning"onClick={handleToggle}>Toggle Visibility</button>
    <button className="btn btn-success" onClick={() => navigate(`/issue/repo/${repository._id}`)}>View Issues</button>
    <button className="btn btn-light" onClick={() => navigate(`/issue/create/${repository._id}`)}>Create Issue</button>
    </div>
</div>
);

};

export default RepositoryView;
