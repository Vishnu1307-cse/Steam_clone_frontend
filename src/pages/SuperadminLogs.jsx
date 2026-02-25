import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/useAuth";

export default function SuperadminLogs() {
  const [logs, setLogs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== "superadmin") return;
    const fetchLogs = async () => {
      try {
        const res = await api.get(`/superadmin/logs`);
        setLogs(res.data.logs || []);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    };

    fetchLogs();
  }, [user]);

  if (user?.role !== "superadmin") {
    return <p style={{ textAlign: "center" }}>Access denied</p>;
  }

  return (
    <div className="dashboard">
      <h2>System Activity Logs</h2>
      {logs.length === 0 ? (
        <p>No logs available.</p>
      ) : (
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {logs.map((l) => (
            <div key={l._id} style={{ padding: 12, borderBottom: "1px solid #444" }}>
              <strong>{l.user?.username} ({l.user?.email})</strong>
              <div>Action: {l.action}</div>
              <div>When: {new Date(l.createdAt).toLocaleString()}</div>
              <div>IP: {l.ip}</div>
              <div>Agent: {l.userAgent}</div>
              {l.details && <div>Details: {l.details}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
