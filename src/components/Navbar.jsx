
import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    // <nav>
    //   <Link to="/" className="text-decoration-none">
    //     <div>
    //       <img
    //         src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
    //         alt="GitHub Logo"
    //       />
    //       <h3>GitHub</h3>
    //     </div>
    //   </Link>
    //   <div id="right">
    //     <Link to="/create" className="text-decoration-none">
    //       <p>Create a Repository</p>
    //     </Link>
    //     <Link to="/user/profile" className="text-decoration-none">
    //       <p>Profile</p>
    //     </Link>
    //     <Link to="/user/all" className="text-decoration-none">
    //     <p>All Users</p>
    //     </Link>
    //   </div>
    // </nav>
    <nav className="navbar navbar-expand-md bg-body-light border-bottom sticky-top">
      <div className="container-fluid">
        <Link to="/" className="text-decoration-none d-flex align-items-center">
          <img
            src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
            style={{ width: "30px", marginRight: "10px" }}
          />
          <h3 className="m-0">GitHub</h3>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="ms-auto d-flex gap-3 align-items-center">
            <Link to="/create" className="text-decoration-none">
              <p className="m-0">Create a Repository</p>
            </Link>
            <Link to="/user/profile" className="text-decoration-none">
              <p className="m-0">Profile</p>
            </Link>
            <Link to="/user/all" className="text-decoration-none">
              <p className="m-0">All Users</p>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
