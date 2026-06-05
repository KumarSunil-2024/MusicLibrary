import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Songs from "../pages/Songs";
import Playlists from "../pages/Playlists";

import AdminDashboard from "../pages/AdminDashboard";
import ManageSongs from "../pages/ManageSongs";

import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}

      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* User Routes */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/songs"
        element={
          <ProtectedRoute>
            <Songs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/playlists"
        element={
          <ProtectedRoute>
            <Playlists />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/songs"
        element={
          <ProtectedRoute>
            <ManageSongs />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
