import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useTheme } from "../auth/ThemeContext";
import api from "../api/axios";
import "../styles/header.css";

export default function Header({ onSearchResults, onHome, onLogout }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const res = await api.get(`/games/search?name=${query}`);
      onSearchResults(res.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="steam-global-header">
      {/* TOP MAIN BAR */}
      <div className="steam-top-bar">
        <div className="steam-header-content">
          {/* BRAND LOGO */}
          <div className="steam-brand" onClick={onHome}>
            <div className="steam-logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" width="34" height="34">
                <path d="M12 2a10 10 0 0 0-10 10c0 4.67 3.2 8.59 7.54 9.65l3.27-4.52a3.47 3.47 0 0 1-1.31-2.73c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5h-.16l-4.57 3.24A10 10 0 1 0 12 2zm2.5 11.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
              </svg>
            </div>
            <div className="steam-logo-text">
              STEAM <span>CLONE</span>
            </div>
          </div>

          {/* MAIN NAVIGATION */}
          <nav className="steam-main-nav">
            <span
              className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}
              onClick={onHome}
            >
              Store
            </span>
            <span
              className={`nav-item ${isActive("/library") ? "active" : ""}`}
              onClick={() => navigate("/library")}
            >
              Library
            </span>
            <span
              className={`nav-item ${isActive("/account") ? "active" : ""}`}
              onClick={() => navigate("/account")}
            >
              Account
            </span>
            <span
              className={`nav-item ${isActive("/upload") ? "active" : ""}`}
              onClick={() => navigate("/upload")}
            >
              Upload
            </span>

            {(user?.role === "employee" || user?.role === "admin" || user?.role === "superadmin") && (
              <span
                className={`nav-item badge-nav ${isActive("/employee/users") ? "active" : ""}`}
                onClick={() => navigate("/employee/users")}
              >
                Users
              </span>
            )}

            {user?.role === "superadmin" && (
              <span
                className={`nav-item badge-nav super-badge ${isActive("/superadmin/logs") ? "active" : ""}`}
                onClick={() => navigate("/superadmin/logs")}
              >
                Logs
              </span>
            )}
          </nav>

          {/* RIGHT SIDE: THEME TOGGLE + USER + LOGOUT */}
          <div className="steam-user-actions">
            {/* Dark/Light Toggle */}
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            {/* User Profile */}
            <div className="user-profile-badge">
              <div className="user-avatar-frame">
                <img
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || "Gamer"}`}
                  alt="avatar"
                />
              </div>
              <div className="user-meta">
                <span className="user-name">{user?.username || "Gamer"}</span>
                <span className="user-role-tag">{user?.role || "user"}</span>
              </div>
            </div>

            <button className="steam-logout-btn" onClick={onLogout} title="Logout">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* SECONDARY SUBNAV WITH SEARCH */}
      <div className="steam-store-subnav">
        <div className="store-subnav-content">
          <div className="store-nav-links">
            <span className="store-sub-link active" onClick={onHome}>Your Store</span>
            <span className="store-sub-link" onClick={onHome}>Featured</span>
            <span className="store-sub-link" onClick={() => navigate("/library")}>My Collection</span>
          </div>

          <form className="steam-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="steam-search-input"
              placeholder="search store..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="steam-search-btn">🔍</button>
          </form>
        </div>
      </div>
    </header>
  );
}
