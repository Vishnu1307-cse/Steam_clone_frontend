import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import api from "../api/axios";
import "../styles/header.css";

export default function Header({ onSearchResults, onHome, onLogout }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();


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

  return (
    <header className="app-header">
      <div className="header-inner">

        {/* LEFT SIDE: NAV + SEARCH */}
        <div className="header-left">
          <nav>
            <span onClick={onHome}>Home</span>
            <span onClick={() => navigate("/library")}>Library</span>
            <span onClick={() => navigate("/account")}>My Account</span>
            <span onClick={() => navigate("/upload")}>Upload Games</span>
            <span onClick={onLogout}>Logout</span>
              {user?.role === "admin" && (
            <span onClick={() => navigate("/admin/users")}>
              All Users
            </span>
            )}
          </nav>

          <form className="search" onSubmit={handleSearch}>
            <input
              placeholder="Search games..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>

        {/* RIGHT / CENTER LOGO */}
        <div className="logo" onClick={onHome}>
          Steam Clone
        </div>

      </div>
    </header>
  );
}
