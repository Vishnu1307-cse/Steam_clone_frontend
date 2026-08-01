import { useNavigate } from "react-router-dom";

export default function GameCard({ game }) {
  const navigate = useNavigate();

  const stars = "⭐⭐⭐⭐";
  const isFree = game.price === 0;

  return (
    <div
      className="steam-game-card"
      onClick={() => navigate(`/games/${game._id}`)}
    >
      {/* Cover Image */}
      <div className="card-media-wrapper">
        <img
          src={game.coverImage}
          alt={game.title}
          className="game-cover-img"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x170/1a2332/66c0f4?text=No+Image";
          }}
        />
        {/* Hover Overlay */}
        <div className="card-hover-overlay">
          <div className="view-details-btn">▶ VIEW DETAILS</div>
          <div className="card-star-rating">{stars}</div>
        </div>
      </div>

      {/* Card Info */}
      <div className="card-info-content">
        <div className="game-card-title" title={game.title}>
          {game.title}
        </div>

        <div className="card-footer-row">
          <span className="game-uploader-tag">
            {game.uploadedBy?.username ? `by ${game.uploadedBy.username}` : "Steam Store"}
          </span>
          <div className="steam-price-badge">
            <span className="price-tag">
              {isFree ? "FREE" : `₹${game.price}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
