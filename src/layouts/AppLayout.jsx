import { useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../auth/useAuth";

export default function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const homeHandlerRef = useRef(null);

  const handleHome = () => {
    if (homeHandlerRef.current) {
      homeHandlerRef.current(); // 🔥 call dashboard fetch
    }
    navigate("/dashboard");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <Header onHome={handleHome} onLogout={handleLogout} />
      <Outlet
        context={{
          registerHomeHandler: (fn) => (homeHandlerRef.current = fn)
        }}
      />
    </>
  );
}
