import { useNavigate } from "react-router-dom";

import "../styles/dashboard.css";

export default function GameCard({ game }) {
  const navigate = useNavigate();

  return (
    <div
      className="game-card"
      onClick={() => navigate(`/games/${game._id}`)}
    >
      <div className="image-wrap">
        <img src={game.coverImage} alt={game.title} />
      </div>

      <h3>{game.title}</h3>

      <div className="price">₹{game.price}</div>

      <div className="creator">
        By {game.uploadedBy?.username || "Unknown"}
      </div>
    </div>
  );
}
