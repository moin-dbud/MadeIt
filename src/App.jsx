import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import {
  ProtectedRoute,
  PublicOnlyRoute,
  ProjectOwnerRoute,
  OptionalAuthRoute
} from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import About from "./pages/About";
import Documentation from "./pages/Documentation";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CohortRegistration from "./pages/CohortRegistration";
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
          {/* HOME - Public only (redirects if logged in) */}
          <Route
            path="/"
            element={
              <PublicOnlyRoute>
                <>
                  <Navbar />
                  <Home />
                </>
              </PublicOnlyRoute>
            }
          />

          {/* LOGIN - Public only (redirects if logged in) */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />

          {/* PROFILE SETUP - Protected (allows incomplete profiles) */}
          <Route
            path="/profile-setup"
            element={
              <ProtectedRoute requireProfileSetup={true}>
                <ProfileSetup />
              </ProtectedRoute>
            }
          />

          {/* DASHBOARD - Protected (requires completed profile) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* PROJECTS LIST - Protected */}
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />

          {/* PROJECT DETAIL - Protected + Owner validation */}
          <Route
            path="/projects/:projectId"
            element={
              <ProtectedRoute>
                <ProjectOwnerRoute>
                  <ProjectPage />
                </ProjectOwnerRoute>
              </ProtectedRoute>
            }
          />

          {/* USER PORTFOLIO - Protected */}
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <Portfolio />
              </ProtectedRoute>
            }
          />

          {/* SUPPORT - Protected */}
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
            element={
              <OptionalAuthRoute>
                <Portfolio />
              </OptionalAuthRoute>
            }
          />

          {/* CONTACT US - Accessible to anyone */}
          <Route
            path="/contact-us"
            element={
              <OptionalAuthRoute>
                <>
                  <Navbar />
                  <ContactUs />
                </>
              </OptionalAuthRoute>
            }
          />

          {/* ABOUT - Accessible to anyone */}
          <Route
            path="/about"
            element={
              <OptionalAuthRoute>
                <>
                  <Navbar />
                  <About />
                </>
              </OptionalAuthRoute>
            }
          />

          {/* PRIVACY POLICY - Accessible to anyone */}
          <Route
            path="/privacy-policy"
            element={
              <OptionalAuthRoute>
                <>
                  <Navbar />
                  <PrivacyPolicy />
                </>
              </OptionalAuthRoute>
            }
          />

          {/* TERMS OF SERVICE - Accessible to anyone */}
          <Route
            path="/terms-of-service"
            element={
              <OptionalAuthRoute>
                <>
                  <Navbar />
                  <TermsOfService />
                </>
              </OptionalAuthRoute>
            }
          />

          {/* DOCUMENTATION - Accessible to anyone */}
          <Route
            path="/documentation"
            element={
              <OptionalAuthRoute>
                <>
                  <Navbar />
                  <Documentation />
                </>
              </OptionalAuthRoute>
            }
          />

          {/* COHORT REGISTRATION - Accessible to anyone */}
          <Route
            path="/cohort"
            element={
              <OptionalAuthRoute>
                <>
                  <Navbar />
                  <CohortRegistration />
                </>
              </OptionalAuthRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}