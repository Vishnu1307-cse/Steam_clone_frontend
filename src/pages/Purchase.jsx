import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function Purchase() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      const res = await api.get(`/games/${gameId}`);
      setGame(res.data);
      setLoading(false);
    };

    fetchGame();
  }, [gameId]);

  const handlePurchase = async () => {
    try {
      await api.post(`/games/purchase/${gameId}`);
      alert("Purchase successful!");
      navigate("/library");
    } catch (err) {
      alert(err.response?.data?.message || "Purchase failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="game-details">
      <h2>Confirm Purchase</h2>

      <img src={game.coverImage} alt={game.title} />
      <h3>{game.title}</h3>
      <p>{game.description}</p>
      <p className="price">₹{game.price}</p>

      <button onClick={handlePurchase}>
        Confirm Purchase
      </button>
    </div>
  );
}
