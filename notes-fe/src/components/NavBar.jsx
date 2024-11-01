import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../api/auth"; // Use your custom hook

const Navbar = () => {
  const isAuthenticated = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaxz8xaGr7KWjVPOXM5onUNrK3v9pAvxnNfA&s"
            alt="Logo"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          MyApp
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {/* Conditionally render Logout if user is authenticated */}
            {isAuthenticated ? (
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={logoutUser}>
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
