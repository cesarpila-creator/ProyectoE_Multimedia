import { Routes, Route, Navigate } from "react-router-dom";

// LAYOUT
import MainLayout from "./layouts/MainLayout";

// PAGES
import Home from "./pages/Home";

import Upload from "./pages/Upload";

import Favorites from "./pages/Favorites";

import MyVideos from "./pages/MyVideos";

import Categories from "./pages/Categories";

import VideoPlayer from "./pages/VideoPlayer";

import PublicVideo from "./pages/PublicVideo";

import Login from "./pages/Login";

import Register from "./pages/Register";

import CategoryVideos from "./pages/CategoryVideos";

// PROTECTED ROUTE
import ProtectedRoute from "./routes/ProtectedRoute";

// AUTH
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* =========================
          PUBLIC ROUTES
      ========================== */}

      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />

      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" /> : <Register />}
      />

      {/* PUBLIC VIDEO */}
      <Route path="/watch/:shareId" element={<PublicVideo />} />

      {/* =========================
          PROTECTED ROUTES
      ========================== */}

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                {/* HOME */}
                <Route path="/" element={<Home />} />

                {/* VIDEO */}
                <Route path="/video/:id" element={<VideoPlayer />} />

                {/* UPLOAD */}
                <Route path="/upload" element={<Upload />} />

                {/* FAVORITES */}
                <Route path="/favorites" element={<Favorites />} />

                {/* MY VIDEOS */}
                <Route path="/my-videos" element={<MyVideos />} />

                {/* CATEGORIES */}
                <Route path="/categories" element={<Categories />} />

                {/* CATEGORY VIDEOS */}
                <Route path="/categories/:id" element={<CategoryVideos />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
