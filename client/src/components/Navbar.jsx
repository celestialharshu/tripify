import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <svg width="26" height="26" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="var(--primary)" />
            <polygon points="32,12 38,32 32,52 26,32" fill="var(--accent)" />
          </svg>
          Tripify
        </Link>

        <button
          className="navbar-burger"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" onClick={() => setMenuOpen(false)} end>
            Home
          </NavLink>
          <NavLink to="/planner" onClick={() => setMenuOpen(false)}>
            Plan a Trip
          </NavLink>
          {user && (
            <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>
              My Trips
            </NavLink>
          )}

          <div className="navbar-auth">
            {user ? (
              <>
                <span className="navbar-username">Hi, {user.name.split(" ")[0]}</span>
                <button className="btn btn-outline" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                  Sign up
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
