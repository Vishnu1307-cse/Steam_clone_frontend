import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../api/axios";
import GameCard from "../components/GameCard";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const { registerHomeHandler } = useOutletContext();

  const fetchAllGames = async () => {
    setLoading(true);
    try {
      const res = await api.get("/games");
      setGames(res.data);
    } catch (err) {
      console.error("Failed to fetch games", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllGames();
    registerHomeHandler(fetchAllGames); // 🔥 expose to layout
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading games...</p>;
  }

  return (
    <div className="dashboard">
      <div className="games-grid">
        {games.length > 0 ? (
          games.map((game) => (
            <GameCard key={game._id} game={game} />
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No games found.</p>
        )}
      </div>
    </div>
  );
}
