import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import server from "../../../Environment.js";
const server_url=server;
const FollowUser = () => {
    const check=useRef(false);
  const { id, userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if(check.current) return;
    check.current=true;
    const follow = async () => {
      try {
        const result = await fetch(`${server_url}/user/follow/${id}/${userId}`, {
          method: "PATCH",
        });

        const data = await result.json();

        if (!result.ok) {
          alert(data.message || "Error following/unfollowing the user");
          return navigate("/user/all");
        }

        alert(data.message || "Follow/unfollow successful");
        navigate("/user/all");
      } catch (err) {
        console.error("Network or server error:", err);
        alert("An error occurred while processing the follow request");
        navigate("/user/all");
      }
    };

    follow();
  }, [id, userId, navigate]);

  return null;
};

export default FollowUser;
