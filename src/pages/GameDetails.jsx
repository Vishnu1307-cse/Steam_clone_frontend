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
      const res = await api.get(`/games/${id}`);
      setGame(res.data);
      setForm({
        title: res.data.title,
        description: res.data.description,
        price: res.data.price,
        coverImage: res.data.coverImage
      });
    };

    fetchGame();
  }, [id]);

  if (!game) return <p>Loading...</p>;

  const isOwner = user && game.uploadedBy?._id === user.id;
  const isAdmin = user?.role === "admin";

  const handleSave = async () => {
    const res = await api.put(`/games/${id}`, form);
    setGame(res.data);
    setEditMode(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this game?")) return;
    await api.delete(`/games/${game._id}`);
    navigate("/dashboard");
  };

  return (
    <div className="game-details">
      <img src={game.coverImage} alt={game.title} />

      {!editMode ? (
        <>
          <h1>{game.title}</h1>
          <p className="price">₹{game.price}</p>
          <p className="desc">{game.description}</p>
          <p className="creator">Created by {game.uploadedBy.username}</p>

          <div className="actions">
            {isOwner && (
              <button
                className="edit-btn"
                onClick={() => setEditMode(true)}
              >
                Edit
              </button>
            )}

            {!isOwner && (
              <button
                className="purchase-btn"
                onClick={() => navigate(`/purchase/${game._id}`)}
              >
                Purchase
              </button>
            )}

            {(isOwner || isAdmin) && (
              <button
                className="delete-btn"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <input
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <input
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <input
            value={form.coverImage}
            onChange={(e) =>
              setForm({ ...form, coverImage: e.target.value })
            }
          />

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <div className="actions">
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button
              className="delete-btn"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
