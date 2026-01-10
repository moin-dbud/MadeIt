import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Documentation from "./pages/Documentation";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectPage from "./pages/ProjectPage";
import Portfolio from "./pages/Portfolio";
import ContactUs from "./pages/ContactUs";
import Support from "./pages/Support";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
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

          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />

          {/* PUBLIC PORTFOLIO - Accessible to anyone */}
          <Route
            path="/portfolio/:username"
            element={<Portfolio />}
          />

          {/* CONTACT US - Accessible to anyone */}
          <Route
            path="/contact-us"
            element={
              <>
                <Navbar />
                <ContactUs />
              </>
            }
          />

          {/* ABOUT - Accessible to anyone */}
          <Route
            path="/about"
            element={
              <>
                <Navbar />
                <About />
              </>
            }
          />

          {/* PRIVACY POLICY - Accessible to anyone */}
          <Route
            path="/privacy-policy"
            element={
              <>
                <Navbar />
                <PrivacyPolicy />
              </>
            }
          />

          {/* TERMS OF SERVICE - Accessible to anyone */}
          <Route
            path="/terms-of-service"
            element={
              <>
                <Navbar />
                <TermsOfService />
              </>
            }
          />

          {/* DOCUMENTATION - Accessible to anyone */}
          <Route
            path="/documentation"
            element={
              <>
                <Navbar />
                <Documentation />
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}