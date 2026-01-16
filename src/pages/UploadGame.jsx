import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/gameDetails.css"; // reuse form styles

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
      navigate("/account"); // 👈 see your uploaded games
    } catch (err) {
      console.error("Failed to upload game", err);
      alert("Failed to upload game");
    }
  };

  return (
    <div className="game-details">
      <h2>Upload New Game</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Game Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          name="coverImage"
          placeholder="Cover Image URL"
          value={form.coverImage}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Game Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <button type="submit">Upload Game</button>
      </form>
    </div>
  );
}
