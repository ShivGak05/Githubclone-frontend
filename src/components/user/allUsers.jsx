import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./user.css";
import server from "../../../Environment.js";
import "./allusers.css"
const server_url = server;

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingStates, setFollowingStates] = useState({});
  const navigate = useNavigate();
  const currId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await fetch(`${server_url}/user/all`);
        const data = await result.json();
        if (Array.isArray(data)) {
          const filteredUsers = data.filter(
            (user) => String(user._id) !== String(currId)
          );
          setUsers(filteredUsers);
        } else {
          console.warn("Unexpected response while fetching users:", data);
          setUsers([]);
        }
      } catch (err) {
        console.error(err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate, currId]);

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
    // Optimistic update
    setFollowingStates(prev => ({
      ...prev,
      [targetUserId]: !prev[targetUserId]
    }));

    try {
      const res = await fetch(
        `${server_url}/user/follow/${currId}/${targetUserId}`,
        {
          method: "PATCH",
        }
      );
      const data = await res.json();

      if (!res.ok) {
        // Revert optimistic update on error
        setFollowingStates(prev => ({
          ...prev,
          [targetUserId]: !prev[targetUserId]
        }));
        alert(data.message || "Error while following/unfollowing");
        return;
      }

      const updatedRes = await fetch(`${server_url}/user/${currId}`);
      const updatedData = await updatedRes.json();
      setCurrentUser(updatedData.user);
    } catch (err) {
      // Revert optimistic update on error
      setFollowingStates(prev => ({
        ...prev,
        [targetUserId]: !prev[targetUserId]
      }));
      console.error("Error toggling follow:", err);
    }
  };

  const isFollowing = (userId) => {
    if (followingStates[userId] !== undefined) {
      return followingStates[userId];
    }
    return currentUser?.followedUsers?.some(
      (id) => String(id) === String(userId)
    );
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid2 px-3 px-md-4 mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-6">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary mb-2">Discover People</h2>
            <p className="text-muted">Connect with amazing people in our community</p>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3">
                <i className="fas fa-users fa-3x text-muted"></i>
              </div>
              <h4 className="text-muted">No users found</h4>
              <p className="text-muted">Check back later for new members!</p>
            </div>
          ) : (
            <div className="row g-3">
              {users.map((user) => {
                const following = isFollowing(user._id);
                
                return (
                  <div key={user._id} className="col-12 col-md-6 col-lg-12">
                    <div className="card h-100 shadow-sm border-0 user-card">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center flex-grow-1">
                            <div className="user-avatar me-3">
                              <div className="avatar-circle bg-primary text-white d-flex align-items-center justify-content-center">
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="user-info">
                              <h5 className="mb-1 fw-semibold">{user.username}</h5>
                              <div className="d-flex flex-wrap gap-3 text-muted small">
                                <span>
                                  <i className="fas fa-user-friends me-1"></i>
                                  {user.followedUsers?.length || 0} Following
                                </span>
                                <span>
                                  <i className="fas fa-users me-1"></i>
                                  {user.followers?.length || 0} Followers
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="ms-3">
                            <button
                              className={`btn btn-sm px-3 py-2 fw-medium ${
                                following
                                  ? "btn-outline-danger"
                                  : "btn-primary"
                              }`}
                              onClick={() => handleFollowToggle(user._id)}
                              //disabled={followingStates[user._id] !== undefined}
                            >
                              {following ? (
                                <>
                                  <i className="fas fa-user-minus me-1"></i>
                                  Unfollow
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-user-plus me-1"></i>
                                  Follow
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;