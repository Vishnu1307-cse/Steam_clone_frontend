import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/gameDetails.css";

export default function UploadGame() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    coverImage: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/games", form);
      navigate("/account");
    } catch (err) {
      console.error("Failed to upload game", err);
      alert("Failed to upload game");
    }
  };

  return (
    <div className="steam-product-page" style={{ paddingTop: "20px" }}>
      <div className="product-page-content" style={{ maxWidth: "700px" }}>
        <h1 className="product-main-title">PUBLISH TO STEAM CLONE STORE</h1>

        <div className="edit-game-form" style={{ background: "linear-gradient(135deg, #1b2838 0%, #101721 100%)", border: "1px solid rgba(102, 192, 244, 0.3)" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label>GAME TITLE</label>
              <input
                name="title"
                placeholder="e.g. Cyberpunk Odyssey"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>PRICE (INR ₹)</label>
              <input
                name="price"
                placeholder="e.g. 1499"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>COVER IMAGE / BANNER URL</label>
              <input
                name="coverImage"
                placeholder="https://images.unsplash.com/..."
                value={form.coverImage}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>GAME DESCRIPTION</label>
              <textarea
                name="description"
                placeholder="Provide game features, system requirements, and storyline details..."
                value={form.description}
                onChange={handleChange}
                rows={6}
                required
              />
            </div>

            <button type="submit" className="steam-btn-green" style={{ marginTop: "10px", justifyContent: "center" }}>
              PUBLISH GAME LISTING
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
