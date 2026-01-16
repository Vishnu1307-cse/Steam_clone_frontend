import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import GameCard from "../components/GameCard";
import "../styles/dashboard.css";

export default function MyAccount() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyGames = async () => {
    try {
      const res = await api.get("/games?mine=true");
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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this game?")) return;

    await api.delete(`/games/${id}`);
    setGames(games.filter(g => g._id !== id));
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading your games...</p>;
  }

  return (
    <div className="dashboard">
      <h2 style={{ marginBottom: "20px" }}>My Uploaded Games</h2>

      <div className="games-grid">
        {games.length > 0 ? (
          games.map((game) => (
            <div key={game._id} style={{ position: "relative" }}>
              <GameCard game={game} />
              
              {/* DELETE BUTTON */}
              <button
                onClick={() => handleDelete(game._id)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px"
                }}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>You haven’t uploaded any games yet.</p>
        )}
      </div>
    </div>
  );
}
