import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth";
import GameCard from "../components/GameCard";
import "../styles/dashboard.css";

export default function MyAccount() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMyGames = async () => {
    try {
      const res = await api.get("/games/me");
      setGames(res.data);
    } catch (err) {
      console.error("Failed to fetch my games", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGames();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Remove this uploaded game from store?")) return;

    try {
      await api.delete(`/games/${id}`);
      setGames(games.filter(g => g._id !== id));
    } catch (err) {
      alert("Failed to delete game");
    }
  };

  if (loading) {
    return (
      <div className="steam-dashboard-container">
        <div className="steam-loader">
          <div className="spinner"></div>
          <p>LOADING STEAM PROFILE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="steam-dashboard-container">
      {/* STEAM PROFILE HEADER BANNER */}
      <div style={{
        background: "linear-gradient(135deg, #1b2838 0%, #101721 100%)",
        padding: "24px",
        borderRadius: "4px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        marginBottom: "30px",
        border: "1px solid rgba(102, 192, 244, 0.2)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
      }}>
        <div style={{
          width: "74px",
          height: "74px",
          borderRadius: "4px",
          border: "2px solid #66c0f4",
          background: "#2a475e",
          overflow: "hidden"
        }}>
          <img 
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'Gamer'}`}
            alt="profile avatar"
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        <div style={{ flexGrow: 1 }}>
          <h1 style={{ color: "#ffffff", fontSize: "24px", margin: 0 }}>{user?.username}</h1>
          <span style={{ color: "#66c0f4", fontSize: "13px" }}>Role: {user?.role?.toUpperCase()}</span>
          <p style={{ color: "#8f98a0", fontSize: "12px", marginTop: "4px" }}>Email: {user?.email}</p>
        </div>

        <div style={{
          background: "rgba(0,0,0,0.4)",
          padding: "12px 20px",
          borderRadius: "4px",
          border: "1px solid rgba(255,255,255,0.05)",
          textAlign: "center"
        }}>
          <span style={{ display: "block", fontSize: "20px", fontWeight: "bold", color: "#66c0f4" }}>{games.length}</span>
          <span style={{ fontSize: "11px", color: "#8f98a0" }}>UPLOADED GAMES</span>
        </div>
      </div>

      <div className="catalog-header-bar">
        <h2 className="section-title">MY PUBLISHED TITLES</h2>
      </div>

      <div className="steam-games-grid">
        {games.length > 0 ? (
          games.map((game) => (
            <div key={game._id} style={{ position: "relative" }}>
              <GameCard game={game} />
              
              <button
                onClick={(e) => handleDelete(e, game._id)}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "rgba(220, 38, 38, 0.85)",
                  color: "#ffffff",
                  fontSize: "11px",
                  padding: "4px 8px",
                  borderRadius: "2px",
                  zIndex: 20
                }}
              >
                DELETE
              </button>
            </div>
          ))
        ) : (
          <div className="empty-store-msg">
            <h3>You haven't uploaded any games yet.</h3>
            <p>Click on "Upload Game" in the top bar to share your creation!</p>
          </div>
        )}
      </div>
    </div>
  );
}
