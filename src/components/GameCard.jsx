import { useNavigate } from "react-router-dom";

export default function GameCard({ game }) {
  const navigate = useNavigate();

  return (
    <div
      className="game-card"
      onClick={() => navigate(`/games/${game._id}`)}
      style={{ cursor: "pointer" }}
    >
      <img src={game.coverImage} alt={game.title} />
      <h3>{game.title}</h3>
      <p className="price">₹{game.price}</p>
      <p className="creator">By {game.uploadedBy?.username}</p>
    </div>
  );
}
