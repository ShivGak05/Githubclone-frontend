import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [repos, setRepos] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const { setCurrentUser } = useAuth();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;

      try {
        const [userRes, repoRes, followingRes] = await Promise.all([
          axios.get(`13.53.131.133:3000/user/${userId}`),
          axios.get(`13.53.131.133:3000/repo/user/${userId}`),
          axios.get(`13.53.131.133:3000/user/${userId}/following`)
        ]);

        setUserDetails(userRes.data);
        setRepos(repoRes.data);
        setFollowingUsers(followingRes.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfileData();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    window.location.href = "/auth";
  };
  console.log(repos);
  console.log(userDetails);
  return (
    <>
 <div className="container py-4">
  {/* Profile Header */}
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h2>
      <span className="badge bg-warning text-dark">Your Profile</span>
    </h2>
    <button 
      onClick={handleLogout} 
      className="btn btn-danger"
      style={{ position: "fixed", bottom: "50px", right: "50px" }}
    >
      Logout
    </button>
  </div>

  {/* Profile Section */}
  <div className="row">
    {/* Left Column */}
    <div className="col-md-4 mb-4">
      <div className="card text-center shadow-sm">
        <div className="card-body">
          <div className="profile-image mb-3">
            {/* Add image tag if you have image */}
             <FontAwesomeIcon icon={faUser} size="2x" className="mb-2" />
          </div>
          <h4 className="card-title name">@{userDetails?.user?.username}</h4>
          <div className="mt-3">
            <p><strong>{userDetails.followers?.length || 0}</strong> Followers</p>
            <p><strong>{userDetails.followedUsers?.length || 0}</strong> Following</p>
          </div>

          <div className="followed-users text-start">
           <span class="badge text-bg-success ">Following</span>
            <ul className="list-group listy">
              {followingUsers.map((user) => (
                <li key={user._id} className="list-group-item name2">@{user.username}</li>
              ))}
            </ul>
          </div>

          <button 
            className="btn btn-primary mt-3" 
            onClick={() => navigate(`/user/update/${userDetails._id}`)}
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>

    {/* Right Column */}
    <div className="col-md-8">
      {/* Heat Map */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body cardheat">
          <HeatMapProfile />
        </div>
      </div>

      {/* Repositories */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title name">Your Repositories</h5>
          <ul className="list-group list-group-flush">
            {Array.isArray(repos.repositories) && repos.repositories.length > 0 ? (
              repos.repositories.map((repo) => (
                <li key={repo._id} className="list-group-item">
                  <strong>{repo.name}</strong> – {repo.description || "No description"}
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">No repositories found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
</>
  );
};

export default Profile;
