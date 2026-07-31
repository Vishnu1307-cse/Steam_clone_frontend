import { useEffect, useState } from "react";
import api from "../api/axios";
import GameCard from "../components/GameCard";
import "../styles/dashboard.css";

export default function Library() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await api.get("/library");
        setGames(res.data);
      } catch (err) {
        console.error("Failed to fetch library", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  if (loading) {
    return (
      <div className="steam-dashboard-container">
        <div className="steam-loader">
          <div className="spinner"></div>
          <p>OPENING STEAM LIBRARY...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="steam-dashboard-container">
      <div className="catalog-header-bar" style={{ marginTop: "10px" }}>
        <h2 className="section-title">MY GAME COLLECTION ({games.length})</h2>
      </div>

      <div className="steam-games-grid">
        {games.length > 0 ? (
          games.map((game) => (
            <GameCard key={game._id} game={game} />
          ))
        ) : (
          <div className="empty-store-msg">
            <h3>Your Steam Library is empty.</h3>
            <p>Browse the store to purchase your favorite titles!</p>
          </div>
        )}
      </div>
    </div>
  );
}
