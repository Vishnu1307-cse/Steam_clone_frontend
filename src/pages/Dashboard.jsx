import { useEffect, useState, useCallback } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import api from "../api/axios";
import GameCard from "../components/GameCard";
import "../styles/dashboard.css";

const CATEGORIES = ["All", "Top Sellers", "New Releases", "Action", "Indie"];
const HERO_COUNT = 5;
const AUTO_ADVANCE_MS = 5000;

export default function Dashboard() {
  const [games, setGames] = useState([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const navigate = useNavigate();
  const outletContext = useOutletContext() || {};
  const { registerHomeHandler, registerSearchHandler } = outletContext;

  const fetchAllGames = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/games");
      setGames(res.data);
    } catch (err) {
      console.error("Failed to fetch games", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (games.length <= 1) return;
    const timer = setInterval(() => {
      setFeaturedIndex((i) => (i + 1) % Math.min(games.length, HERO_COUNT));
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [games.length]);

  useEffect(() => {
    fetchAllGames();
    if (registerHomeHandler) registerHomeHandler(fetchAllGames);
    if (registerSearchHandler) {
      registerSearchHandler((results) => setGames(results));
    }
  }, []);

  const featuredGame = games.length > 0 ? games[featuredIndex % games.length] : null;

  if (loading) {
    return (
      <div className="steam-dashboard-container">
        <div className="steam-loader">
          <div className="spinner" />
          <p>LOADING CATALOG...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="steam-dashboard-container">
      {/* HERO CAROUSEL */}
      {featuredGame && (
        <section className="steam-hero-section">
          <h2 className="section-title">Featured &amp; Recommended</h2>

          <div className="hero-banner-card" onClick={() => navigate(`/games/${featuredGame._id}`)}>
            {/* LEFT: Artwork */}
            <div className="hero-artwork-container">
              <img
                src={featuredGame.coverImage}
                alt={featuredGame.title}
                className="hero-main-img"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x400/1a2332/f59e0b?text=No+Image";
                }}
              />
              <div className="hero-badge">⭐ FEATURED</div>
            </div>

            {/* RIGHT: Details */}
            <div className="hero-details-container">
              <h1 className="hero-title">{featuredGame.title}</h1>

              <div className="hero-screenshot-thumbs">
                <img src={featuredGame.coverImage} alt="thumb" className="thumb active"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/68x43/1a2332/f59e0b?text=IMG"; }}
                />
                <div className="thumb-placeholder">SCN 1</div>
                <div className="thumb-placeholder">SCN 2</div>
              </div>

              <div className="hero-meta">
                <span className="hero-status">▶ Now Available on Steam Clone</span>
                <div className="hero-tags">
                  <span className="tag">Action</span>
                  <span className="tag">Adventure</span>
                  <span className="tag">Multiplayer</span>
                </div>
              </div>

              <div className="hero-price-row">
                <div className="hero-price">
                  {featuredGame.price === 0 ? "FREE" : `₹${featuredGame.price}`}
                </div>
                <button
                  className="steam-btn-green"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/games/${featuredGame._id}`);
                  }}
                >
                  BUY NOW
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Dots */}
          {games.length > 1 && (
            <div className="carousel-dots">
              {games.slice(0, HERO_COUNT).map((g, idx) => (
                <div
                  key={g._id || idx}
                  className={`dot ${idx === featuredIndex ? "active" : ""}`}
                  onClick={() => setFeaturedIndex(idx)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* CATALOG SECTION */}
      <section className="steam-catalog-section">
        <div className="catalog-header-bar">
          <h2 className="section-title">Browse Catalog</h2>
          <div className="category-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* GAMES GRID */}
        <div className="steam-games-grid">
          {games.length > 0 ? (
            games.map((game) => <GameCard key={game._id} game={game} />)
          ) : (
            <div className="empty-store-msg">
              <h3>No games found in the store.</h3>
              <p>Check back later or upload a game!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
