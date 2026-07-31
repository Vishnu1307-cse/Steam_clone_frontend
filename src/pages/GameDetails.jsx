import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth";
import "../styles/gameDetails.css";

export default function GameDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    coverImage: ""
  });

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await api.get(`/games/${id}`);
        setGame(res.data);
        setForm({
          title: res.data.title,
          description: res.data.description,
          price: res.data.price,
          coverImage: res.data.coverImage
        });
      } catch (err) {
        console.error("Failed to load game", err);
      }
    };

    fetchGame();
  }, [id]);

  if (!game) {
    return (
      <div className="steam-product-page">
        <div className="steam-loader">
          <div className="spinner"></div>
          <p>LOADING STORE PAGE...</p>
        </div>
      </div>
    );
  }

  const isOwner = user && game.uploadedBy?._id === user.id;
  const isAdmin = user?.role === "employee" || user?.role === "admin" || user?.role === "superadmin";

  const handleSave = async () => {
    try {
      const res = await api.put(`/games/${id}`, form);
      setGame(res.data);
      setEditMode(false);
    } catch (err) {
      alert("Failed to save changes");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this game from Steam Store?")) return;
    try {
      await api.delete(`/games/${game._id}`);
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to delete game");
    }
  };

  return (
    <div className="steam-product-page">
      {/* CINEMATIC BACKDROP BANNER */}
      <div className="product-backdrop-header" style={{ backgroundImage: `url(${game.coverImage})` }}>
        <div className="backdrop-overlay"></div>
      </div>

      <div className="product-page-content">
        {/* BREADCRUMB NAV */}
        <div className="steam-breadcrumb">
          <span onClick={() => navigate("/dashboard")}>All Games</span> &gt;{" "}
          <span>{game.title}</span>
        </div>

        <h1 className="product-main-title">{game.title}</h1>

        {/* MAIN PRODUCT LAYOUT */}
        <div className="product-grid-layout">
          {/* LEFT MEDIA & DESCRIPTION COLUMN */}
          <div className="product-left-col">
            <div className="product-hero-media">
              <img src={game.coverImage} alt={game.title} className="product-cover-large" />
            </div>

            <div className="product-description-block">
              <h3 className="sub-header-title">ABOUT THIS GAME</h3>
              <div className="description-text">
                {game.description}
              </div>
            </div>
          </div>

          {/* RIGHT METADATA & PURCHASE COLUMN */}
          <div className="product-right-col">
            <div className="product-meta-card">
              <img src={game.coverImage} alt={game.title} className="meta-thumb" />

              <p className="product-short-desc">
                {game.description.slice(0, 150)}...
              </p>

              <div className="meta-info-rows">
                <div className="meta-row">
                  <span className="meta-label">DEVELOPER / UPLOADER:</span>
                  <span className="meta-val">{game.uploadedBy?.username || "Steam Publisher"}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">RELEASE DATE:</span>
                  <span className="meta-val">{new Date(game.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">REVIEWS:</span>
                  <span className="meta-val review-positive">Very Positive</span>
                </div>
              </div>
            </div>

            {/* PURCHASE BLOCK */}
            {!editMode ? (
              <div className="purchase-action-box">
                <h2>Buy {game.title}</h2>
                <div className="purchase-cta-bar">
                  <div className="price-tag-badge">₹{game.price}</div>

                  {!isOwner ? (
                    <button
                      className="steam-btn-green purchase-button"
                      onClick={() => navigate(`/purchase/${game._id}`)}
                    >
                      <span>Buy Now</span>
                    </button>
                  ) : (
                    <span className="owned-badge">OWNED / CREATOR</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="edit-game-form">
                <h3>EDIT STORE LISTING</h3>
                <label>Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <label>Price (₹)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                <label>Cover Image URL</label>
                <input
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                />
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <div className="edit-actions-row">
                  <button className="steam-btn-green" onClick={handleSave}>Save Changes</button>
                  <button className="steam-btn-cancel" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </div>
            )}

            {/* ADMIN / OWNER TOOLBAR */}
            {(isOwner || isAdmin) && !editMode && (
              <div className="admin-actions-card">
                <h4>MANAGEMENT ACTIONS</h4>
                <div className="admin-btn-group">
                  {isOwner && (
                    <button className="steam-btn-blue" onClick={() => setEditMode(true)}>
                      ✏️ Edit Listing
                    </button>
                  )}
                  <button className="steam-btn-danger" onClick={handleDelete}>
                    🗑️ Remove Game
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
