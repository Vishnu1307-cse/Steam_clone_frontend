import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function GameCard({ game }) {
  const navigate = useNavigate();

  return (
    <div
      className="steam-game-card"
      onClick={() => navigate(`/games/${game._id}`)}
    >
      <div className="card-media-wrapper">
        <img src={game.coverImage} alt={game.title} className="game-cover-img" />
        <div className="card-hover-overlay">
          <div className="overlay-info">
            <span className="view-details-btn">VIEW STORE PAGE</span>
          </div>
        </div>
      </div>

      <div className="card-info-content">
        <h3 className="game-card-title">{game.title}</h3>
        
        <div className="card-footer-row">
          <span className="game-uploader-tag">
            By {game.uploadedBy?.username || "Steam Publisher"}
          </span>

          <div className="steam-price-badge">
            <span className="price-tag">₹{game.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
