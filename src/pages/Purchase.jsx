import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "../styles/gameDetails.css";

export default function Purchase() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await api.get(`/games/${gameId}`);
        setGame(res.data);
      } catch (err) {
        console.error("Failed to load game", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  const handlePurchase = async () => {
    try {
      await api.post(`/games/purchase/${gameId}`);
      alert("Purchase successful! Added to your Steam Library.");
      navigate("/library");
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
    }
  };

  if (loading) {
    return (
      <div className="steam-product-page">
        <div className="steam-loader">
          <div className="spinner"></div>
          <p>PREPARING CHECKOUT...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="steam-product-page" style={{ paddingTop: "20px" }}>
      <div className="product-page-content" style={{ maxWidth: "650px" }}>
        <h1 className="product-main-title">CONFIRM PURCHASE</h1>

        <div className="purchase-action-box" style={{ background: "linear-gradient(135deg, #1b2838 0%, #101721 100%)", border: "1px solid rgba(102, 192, 244, 0.4)" }}>
          <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
            <img src={game.coverImage} alt={game.title} style={{ width: "140px", height: "80px", objectFit: "cover", borderRadius: "2px" }} />
            <div>
              <h3 style={{ color: "#ffffff", fontSize: "18px", margin: "0 0 4px" }}>{game.title}</h3>
              <span style={{ color: "#8f98a0", fontSize: "12px" }}>Digital License for Steam Account</span>
            </div>
          </div>

          <div className="purchase-cta-bar" style={{ marginBottom: "20px" }}>
            <span style={{ color: "#c7d5e0", fontSize: "14px" }}>Total Payment Amount:</span>
            <span className="price-tag-badge" style={{ fontSize: "20px" }}>₹{game.price}</span>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button className="steam-btn-green" onClick={handlePurchase} style={{ flexGrow: 1, justifyContent: "center" }}>
              PURCHASE FOR MYSELF
            </button>
            <button className="steam-btn-cancel" onClick={() => navigate(-1)}>
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
