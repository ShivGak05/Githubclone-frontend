import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const id=localStorage.getItem("userId");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        //console.log(id);
        const result = await fetch(`13.53.131.133:3000/user/${id}`);
        const data = await result.json();
        if (!result.ok) {
          alert("Error fetching user");
          return navigate(`/user/profile`);
        }
        setUser(data.user);
        setEmail(data.user.email);
      } catch (err) {
        console.error(err);
        alert("Error fetching user");
        navigate(`/user/profile`);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleUpdate = async () => {
    try {
      const result = await fetch(`13.53.131.133:3000/user/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          oldPassword,
        }),
      });

      const data = await result.json();

      if (!result.ok) {
        alert(data.message || "Error updating user profile");
        return;
      }

      alert(data.message || "Profile updated successfully");
      navigate(`/user/profile`);
    } catch (err) {
      console.error(err);
      alert("Error updating user profile");
    }
  };

  return (
    <div className="container mt-4">
  <div className="row justify-content-center">
      <div className="card shadow">
        <div className="card-body">
          <h4 className="card-title text-center mb-4 name">Update Profile</h4>

          {!user ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <form>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={user.username}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter new email"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="oldPassword" className="form-label">Old Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter your current password"
                />
              </div>

              <div className="d-grid">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdate}
                >
                  Update Profile
                </button>
              </div>
            </form>
          )}
      </div>
    </div>
  </div>
</div>
  );
};

export default UpdateProfile;
