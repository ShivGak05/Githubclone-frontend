
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Search, Calendar, GitBranch, Star } from "lucide-react";
import "./dashboard.css"
import server from "../../../Environment.js"
import Navbar from "../Navbar.jsx";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../logout.jsx";
const server_url=server;
const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedCollapsed, setSuggestedCollapsed] = useState(false);
    const [eventsCollapsed, setEventsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
   const navigate=useNavigate();
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `${server_url}/repo/user/${userId}`
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
    const response = await fetch(`${server_url}/repo/all`);
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
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
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
  const SidebarSection = ({ title, collapsed, onToggle, icon: Icon, children }) => (
      <div className={`sidebar-section ${isMobile ? 'mobile' : ''}`}>
        <div 
          className={`sidebar-header ${isMobile ? 'clickable' : ''}`}
          onClick={isMobile ? onToggle : undefined}
        >
          <div className="sidebar-title">
            <Icon size={18} />
            <h3>{title}</h3>
          </div>
          {isMobile && (
            <button className="collapse-btn" onClick={onToggle}>
              {collapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
          )}
        </div>
        <div className={`sidebar-content ${isMobile && collapsed ? 'collapsed' : ''}`}>
          {children}
        </div>
      </div>
    );
     const RepositoryCard = ({ repo, showVisibility = false }) => (
        <div className="repo-card2">
          <div className="repo-header2">
            <div className="repo-info">
              <GitBranch size={16} />
              <h4 className="repo-name">{repo.name}</h4>
              {showVisibility && (
                <span className={`visibility-badge ${repo.visibility ? 'public' : 'private'}`}>
                  {repo.visibility ? 'Public' : 'Private'}
                </span>
              )}
            </div>
            <Star size={16} className="star-icon" />
          </div>
          <div className="repo-actions">
            <button 
              className="btn btn-primary view-btn"
             onClick={()=>navigate(`/repository/${repo._id}`)}>View Repository</button>
            
          </div>
        </div>
      );
  return (
    <>
       <div className="dashboard-container">
            <Navbar/>
            
            <div className="dashboard-wrapper">
              <div className="dashboard-content">
                {/* Suggested Repositories Sidebar */}
                <aside className="sidebar sidebar-left">
                  <SidebarSection
                    title="Suggested Repositories"
                    collapsed={suggestedCollapsed}
                    onToggle={() => setSuggestedCollapsed(!suggestedCollapsed)}
                    icon={GitBranch}
                  >
                    <div className="suggested-repos">
                      {suggestedRepositories
                        .filter((repo) => repo.visibility)
                        .slice(0, 6)
                        .map((repo) => (
                          <RepositoryCard key={repo._id} repo={repo} showVisibility />
                        ))}
                    </div>
                  </SidebarSection>
                </aside>
      
                {/* Main Content */}
                <main className="main-content">
                  <div className="main-header">
                    <h2 className="page-title">Your Repositories</h2>
                    <div className="search-container">
                      <Search size={20} className="search-icon" />
                      <input
                        type="text"
                        className="search-input"
                        value={searchQuery}
                        placeholder="Search repositories..."
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
      
                  <div className="repositories-grid">
                    {searchResults.length > 0 ? (
                      searchResults.map((repo) => (
                        <RepositoryCard key={repo._id} repo={repo} />
                      ))
                    ) : (
                      <div className="empty-state">
                        <GitBranch size={48} />
                        <h3>No repositories found</h3>
                        <p>Create your first repository to get started!</p>
                      </div>
                    )}
                  </div>
                </main>
      
                {/* Events Sidebar */}
                <aside className="sidebar sidebar-right">
                  <SidebarSection
                    title="Upcoming Events"
                    collapsed={eventsCollapsed}
                    onToggle={() => setEventsCollapsed(!eventsCollapsed)}
                    icon={Calendar}
                  >
                    <div className="events-list">
                      <div className="event-item">
                        <div className="event-date">Dec 15</div>
                        <div className="event-details">
                          <h5>Tech Conference</h5>
                          <p>Join the latest tech discussions</p>
                        </div>
                      </div>
                      <div className="event-item">
                        <div className="event-date">Dec 25</div>
                        <div className="event-details">
                          <h5>Developer Meetup</h5>
                          <p>Network with fellow developers</p>
                        </div>
                      </div>
                      <div className="event-item">
                        <div className="event-date">Jan 5</div>
                        <div className="event-details">
                          <h5>React Summit</h5>
                          <p>Learn about the latest React features</p>
                        </div>
                      </div>
                    </div>
                  </SidebarSection>
                </aside>
              </div>
            </div>
      
            {/* Logout Button */}
            <LogoutButton/>
          </div>
    </>
  );
};

export default Dashboard;
