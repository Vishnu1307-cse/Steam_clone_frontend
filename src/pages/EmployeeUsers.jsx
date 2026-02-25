import { useEffect, useState } from "react";
import api from "../api/axios";

export default function EmployeeUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  const fetchUsers = async () => {
    const res = await api.get(`/employee/users?q=${query}`);
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await api.delete(`/employee/users/${id}`);
    setUsers(users.filter(u => u._id !== id));
  };

  return (
    <div className="dashboard">
      <h2>All Users</h2>

      <input
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
        style={{ marginBottom: "15px" }}
      />

      {users.map(user => (
        <div
          key={user._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            borderBottom: "1px solid #444"
          }}
        >
          <span>{user.username} ({user.email})</span>
          <button onClick={() => handleDelete(user._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
