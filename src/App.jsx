import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectPage from "./pages/ProjectPage";
import Portfolio from "./pages/Portfolio";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTE - Only accessible when NOT logged in */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <>
                <Navbar />
                <Home />
              </>
            </PublicRoute>
          }
        />

        {/* PROTECTED ROUTES - Only accessible when logged in */}
        <Route
          path="/profile-setup"
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />

        {/* PUBLIC PORTFOLIO - Accessible to anyone */}
        <Route
          path="/portfolio/:username"
          element={<Portfolio />}
        />
      </Routes>
    </BrowserRouter>
  );
}