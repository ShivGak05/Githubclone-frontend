import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./user.css";
import server from "../../../Environment.js";
const server_url=server;
const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const currId=localStorage.getItem("userId");
  useEffect(() => {
   const fetchUsers = async () => {
  try {
    const result = await fetch(`${server_url}/user/all`);
    const data = await result.json();
    if (Array.isArray(data)) {
      const filteredUsers = data.filter((user) => String(user._id) !== String(currId));
      setUsers(filteredUsers);
    } else {
      console.warn("Unexpected response while fetching users:", data);
      setUsers([]);
    }
  } catch (err) {
    console.error(err);
    navigate("/");
  }
};


    fetchUsers();
  }, [navigate]);
const [currentUser, setCurrentUser] = useState(null);

useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${server_url}/user/${currId}`);
      const data = await res.json();
      setCurrentUser(data.user);
    } catch (err) {
      console.error("Error fetching current user", err);
    }
  };
  if (currId) fetchCurrentUser();
}, [currId]);

const handleFollowToggle = async (targetUserId) => {
  try {
    const res = await fetch(`${server_url}/user/follow/${currId}/${targetUserId}`, {
      method: "PATCH",
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error while following/unfollowing");
      return;
    }
    const updatedRes = await fetch(`${server_url}/user/${currId}`);
    const updatedData = await updatedRes.json();
    setCurrentUser(updatedData.user); 
  } catch (err) {
    console.error("Error toggling follow:", err);
  }
};

  return (
   <div className="container mt-4 yumyum">
  <h3 className="mb-4 text-center userheading">All Users</h3>

  <div className="d-flex flex-column gap-3 cardy">
    {users.map((user) => {
      const isFollowing = currentUser?.followedUsers?.some(
        (id) => String(id) === String(user._id)
      );

      return (
        <div key={user._id} className="card shadow-sm p-3 bg-light border-2">
          <div className="d-flex justify-content-between align-items-center ">
            <div>
            <h5 className="mb-0">{user.username}</h5>
            <div className="mt-3">
           {/*} <p><strong>{user.followers?.length || 0}</strong> Followers</p>*/}
            <p><strong>{user.followedUsers?.length || 0}</strong> Following</p>
          </div>
          </div>
            <button
              className={`btn ${isFollowing ? "btn-danger" : "btn-success"}`}
              onClick={() => handleFollowToggle(user._id)}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>
      );
    })}
  </div>
</div>

  );
};

export default AllUsers;
