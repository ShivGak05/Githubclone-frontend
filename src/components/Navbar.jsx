
import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav>
      <Link to="/" className="text-decoration-none">
        <div>
          <img
            src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
          />
          <h3>GitHub</h3>
        </div>
      </Link>
      <div id="right">
        <Link to="/create" className="text-decoration-none">
          <p>Create a Repository</p>
        </Link>
        <Link to="/user/profile" className="text-decoration-none">
          <p>Profile</p>
        </Link>
        <Link to="/user/all" className="text-decoration-none">
        <p>All Users</p>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
