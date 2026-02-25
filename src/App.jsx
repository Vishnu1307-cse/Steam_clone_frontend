import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginUser from "./pages/LoginUser";
import LoginEmployee from "./pages/LoginEmployee";
import LoginSuperAdmin from "./pages/LoginSuperAdmin";
import RegisterUser from "./pages/RegisterUser";
import RegisterEmployee from "./pages/RegisterEmployee";

import Dashboard from "./pages/Dashboard";
import MyAccount from "./pages/MyAccount";
import GameDetails from "./pages/GameDetails";
import UploadGame from "./pages/UploadGame"
import Purchase from "./pages/Purchase";
import Library from "./pages/Library";
import EmployeeUsers from "./pages/EmployeeUsers";
import SuperadminLogs from "./pages/SuperadminLogs";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC (NO HEADER) */}
        <Route path="/" element={<LoginUser />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/employee" element={<LoginEmployee />} />
        <Route path="/employee/login" element={<LoginEmployee />} />
        <Route path="/employee/register" element={<RegisterEmployee />} />
        <Route path="/superAdmin" element={<LoginSuperAdmin />} />

        {/* SUPERADMIN ROUTES */}
        <Route
          path="/superadmin/dashboard"
          element={
            <ProtectedRoute requiredRole="superadmin">
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

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
          <Route path="/employee/users" element={<EmployeeUsers />} />
          <Route path="/superadmin/logs" element={<SuperadminLogs />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
