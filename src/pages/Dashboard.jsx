import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import api from "../api/axios";
import GameCard from "../components/GameCard";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [games, setGames] = useState([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const navigate = useNavigate();
  const outletContext = useOutletContext() || {};
  const { registerHomeHandler, registerSearchHandler } = outletContext;

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
    if (registerHomeHandler) registerHomeHandler(fetchAllGames);
    if (registerSearchHandler) {
      registerSearchHandler((results) => {
        setGames(results);
      });
    }
  }, []);

  const featuredGame = games.length > 0 ? games[featuredIndex % games.length] : null;

  if (loading) {
    return (
      <div className="steam-dashboard-container">
        <div className="steam-loader">
          <div className="spinner"></div>
          <p>FETCHING STEAM CATALOG...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="steam-dashboard-container">
      {/* FEATURED & RECOMMENDED HERO CAROUSEL */}
      {featuredGame && (
        <section className="steam-hero-section">
          <h2 className="section-title">FEATURED & RECOMMENDED</h2>
          
          <div className="hero-banner-card" onClick={() => navigate(`/games/${featuredGame._id}`)}>
            <div className="hero-artwork-container">
              <img src={featuredGame.coverImage} alt={featuredGame.title} className="hero-main-img" />
              <div className="hero-badge">FEATURED STORE ITEM</div>
            </div>

            <div className="hero-details-container">
              <h1 className="hero-title">{featuredGame.title}</h1>
              
              <div className="hero-screenshot-thumbs">
                <img src={featuredGame.coverImage} alt="thumb" className="thumb active" />
                <div className="thumb-placeholder">SCREENSHOT 1</div>
                <div className="thumb-placeholder">SCREENSHOT 2</div>
              </div>

              <div className="hero-meta">
                <span className="hero-status">Now Available</span>
                <div className="hero-tags">
                  <span className="tag">Action</span>
                  <span className="tag">Multiplayer</span>
                  <span className="tag">Adventure</span>
                </div>
              </div>

              <div className="hero-price-row">
                <div className="hero-price">₹{featuredGame.price}</div>
                <button className="steam-btn-green" onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/games/${featuredGame._id}`);
                }}>
                  BUY NOW
                </button>
              </div>
            </div>
          </div>

          {/* CAROUSEL CONTROLS */}
          {games.length > 1 && (
            <div className="carousel-dots">
              {games.slice(0, 5).map((g, idx) => (
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

      {/* STORE TABS & CATEGORIES */}
      <section className="steam-catalog-section">
        <div className="catalog-header-bar">
          <h2 className="section-title">BROWSE CATALOG</h2>

          <div className="category-pills">
            {["All", "Top Sellers", "New Releases", "Action", "Indie"].map((cat) => (
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
            games.map((game) => (
              <GameCard key={game._id} game={game} />
            ))
          ) : (
            <div className="empty-store-msg">
              <h3>No games found in the store.</h3>
              <p>Check back later or upload your own game!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
