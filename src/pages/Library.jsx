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
    return <p style={{ textAlign: "center" }}>Loading library...</p>;
  }

  return (
    <div className="dashboard">
      <h2 style={{ marginBottom: "20px" }}>My Library</h2>

      <div className="games-grid">
        {games.length > 0 ? (
          games.map((game) => (
            <GameCard key={game._id} game={game} />
          ))
        ) : (
          <p>You haven’t purchased any games yet.</p>
        )}
      </div>
    </div>
  );
}
