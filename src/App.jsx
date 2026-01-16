import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginUser from "./pages/LoginUser";
import LoginAdmin from "./pages/LoginAdmin";
import RegisterUser from "./pages/RegisterUser";
import RegisterAdmin from "./pages/RegisterAdmin";

import Dashboard from "./pages/Dashboard";
import MyAccount from "./pages/MyAccount";
import GameDetails from "./pages/GameDetails";
import UploadGame from "./pages/UploadGame"
import Purchase from "./pages/Purchase";
import Library from "./pages/Library";
import AdminUsers from "./pages/AdminUsers";




import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC (NO HEADER) */}
        <Route path="/" element={<LoginUser />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/admin" element={<LoginAdmin />} />
        <Route path="/admin/register" element={<RegisterAdmin />} />

        {/* PROTECTED (WITH HEADER) */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/library" element={<Library />} />
          <Route path="/games/:id" element={<GameDetails />} />
          <Route path="/upload" element={<UploadGame />} />
          <Route path="/purchase/:gameId" element={<Purchase />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
