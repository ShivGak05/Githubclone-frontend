
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import Navbar from "../Navbar";
import LogoutButton from "../logout";
const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
   const navigate=useNavigate();
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/repo/user/${userId}`
        );
         if (!response.ok) {
      console.error("Failed to fetch user repositories:", response.statusText);
      return;
    }

    const data = await response.json();
    if (Array.isArray(data.repositories)) {
      setRepositories(data.repositories);
    } else {
      console.warn("No repositories field in response", data);
      setRepositories([]);
    }
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
  try {
    const response = await fetch("http://localhost:3000/repo/all");
    const data = await response.json();

    // If data is an array directly:
    if (Array.isArray(data)) {
      setSuggestedRepositories(data);
    } else if (Array.isArray(data.repositories)) {
      setSuggestedRepositories(data.repositories);
    } else {
      console.warn("Unexpected response for suggested repositories", data);
      setSuggestedRepositories([]);
    }
  } catch (err) {
    console.error("Error fetching suggested repositories:", err);
  }
};

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery == "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />
      <section id="dashboard">
        <aside id="first">
          <h3 className="repohead">Suggested Repositories</h3>
          {suggestedRepositories
      .filter((repo) => repo.visibility)
      .map((repo) =>{
            return (
              <div key={repo._id} className="repobox">
                <h4>{repo.name}</h4>
                <button className="btn btn-success" onClick={()=>navigate(`/repository/${repo._id}`)}>View Repository</button>
              </div>
            );
          })}
        </aside>
        <main id="second">
          <h2 className="repohead">Your Repositories</h2>
          <div id="search" className="searchopt">
            <input
              type="text"
              className="form-control me-2"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchResults.map((repo) => {
            return (
              <div key={repo._id} className="repobox">
                <h4>{repo.name}</h4>
                 <button className="btn btn-success" onClick={()=>navigate(`/repository/${repo._id}`)}>View Repository</button>
              </div>
            );
          })}
        </main>
        <aside id="third">
          <h3 className="repohead">Upcoming Events</h3>
          <ul>
            <li>
              <p>Tech Conference - Dec 15</p>
            </li>
            <li>
              <p>Developer Meetup - Dec 25</p>
            </li>
            <li>
              <p>React Summit - Jan 5</p>
            </li>
          </ul>
        </aside>
      </section>
      <LogoutButton/>
    </>
  );
};

export default Dashboard;
