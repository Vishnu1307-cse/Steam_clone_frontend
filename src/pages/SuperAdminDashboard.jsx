import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth";
import SuperadminLogs from "./SuperadminLogs";
import "../styles/superadmin.css";

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEmployees: 0
  });

  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user?.role !== "superadmin") {
      navigate("/dashboard");
      return;
    }

    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [usersRes, employeesRes] = await Promise.all([
        api.get("/superadmin/users/all"),
        api.get("/superadmin/employees/all")
      ]);

      const usersList = usersRes.data.users || [];
      const employeesList = employeesRes.data.employees || [];

      setUsers(usersList);
      setEmployees(employeesList);

      setStats({
        totalUsers: usersList.length,
        totalEmployees: employeesList.length
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      alert("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ACTIONS ================= */

  const handleBanUser = async (id) => {
    try {
      await api.post(`/superadmin/users/${id}/ban`, {
        reason: prompt("Enter ban reason:")
      });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const handleUnbanUser = async (id) => {
    try {
      await api.post(`/superadmin/users/${id}/unban`);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="superadmin-dashboard">
        Loading...
      </div>
    );
  }

  return (
    <div className="superadmin-dashboard">
      {/* HEADER */}
      <header className="superadmin-header">
        <div className="header-content">
          <h1>🛡️ Super Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>
        </div>
      </header>

      {/* NAV */}
      <nav className="superadmin-nav">
        {["overview", "users", "employees", "logs"].map(
          (tab) => (
            <button
              key={tab}
              className={`nav-btn ${
                activeTab === tab ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "overview" && "Overview"}
              {tab === "users" &&
                `Users (${stats.totalUsers})`}
              {tab === "employees" &&
                `Employees (${stats.totalEmployees})`}
              {tab === "logs" && "Logs"}
            </button>
          )
        )}
      </nav>

      {/* CONTENT */}
      <main className="superadmin-content">
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="overview-section">
            <h2>Dashboard Overview</h2>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>

              <div className="stat-card">
                <h3>{stats.totalEmployees}</h3>
                <p>Total Employees</p>
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <div className="users-section">
            <h2>Manage Users</h2>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          u.isBanned
                            ? "banned"
                            : "active"
                        }`}
                      >
                        {u.isBanned
                          ? "Banned"
                          : "Active"}
                      </span>
                    </td>

                    <td>
                      {u.isBanned ? (
                        <button
                          onClick={() =>
                            handleUnbanUser(
                              u._id
                            )
                          }
                          className="action-btn unban"
                        >
                          Unban
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleBanUser(u._id)
                          }
                          className="action-btn ban"
                        >
                          Ban
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* EMPLOYEES */}
        {activeTab === "employees" && (
          <div className="employees-section">
            <h2>Manage Employees</h2>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((e) => (
                  <tr key={e._id}>
                    <td>{e.username}</td>
                    <td>{e.email}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          e.isBanned
                            ? "banned" : "active"
                        }`}
                      >
                        {e.isBanned
                          ? "Banned" : "Active"}
                      </span>
                    </td>

                    <td>
                      {e.isBanned ? (
                        <button
                          onClick={() =>
                            handleUnbanUser(
                              e._id
                            )
                          }
                          className="action-btn unban"
                        >
                          Unban
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleBanUser(e._id)
                          }
                          className="action-btn ban"
                        >
                          Ban
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* LOGS */}
        {activeTab === "logs" && <SuperadminLogs />}
      </main>
    </div>
  );
}
