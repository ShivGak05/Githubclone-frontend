import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./repo.css";
const UpdateRepo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [repository, setRepository] = useState(null);
  const [description, setDescription] = useState("");
  const [content, setContent] = useState([]);
  const [newContent, setNewContent] = useState("");
 useEffect(() => {
    const fetchRepository = async () => {
      try {
        const response = await fetch(`https://github-backend-jeo7.onrender.com/repo/${id}`);
        const data = await response.json();
        console.log(data.repository);
        if(!data.repository){
          alert("Repo not found");
          return navigate(`/repository/${id}`);
        }else{
        setRepository(data.repository);
        setContent(repository.content);
        setDescription(repository.description);
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
      const result = await axios.put(`https://github-backend-jeo7.onrender.com/repo/update/${id}`, {
        description,
        content,
      });

      alert(result.data.message || "Repository updated!");
      navigate(`/repository/${id}`);
    } catch (err) {
      console.error("Error updating repository:", err);
      alert("Failed to update repository");
    }
  };
 useEffect(() => {
  if (repository) {
    setDescription(repository.description || "");
  }
}, [repository]);

 return (
  <div className="create-repo-container">
    {!repository ? (
      <p>Loading...</p>
    ) : (
      <>
        <h2>Update Repository</h2>

        <label>Repository Name:</label>
        <input type="text" value={repository.name} disabled />

        <label>Description:</label>
        <textarea
          rows="5"
          placeholder={repository.description}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <label htmlFor="content">Content:</label>
{content.map((file, index) => (
  <textarea
    key={index}
    rows="3"
    value={file}
    onChange={(e) => handleContentChange(index, e.target.value)}
    placeholder={`File ${index + 1}`}
    className="mb-2 w-full p-2 border rounded"
  />
))}

<textarea
  rows="3"
  placeholder="Add new file content..."
  value={newContent}
  onChange={(e) => setNewContent(e.target.value)}
  className="mb-4 w-full p-2 border border-dashed rounded"
/>
<div className="btn-group-of-view-repo">
<button onClick={handleAddContent}>Add Content</button>


        <button onClick={handleUpdate}>Update</button>
        </div>
      </>
    )}
  </div>
);


};

export default UpdateRepo;
