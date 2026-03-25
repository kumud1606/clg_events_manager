import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import FeedPage from "./pages/FeedPage";
import CalendarPage from "./pages/CalendarPage";
import CertificatesPage from "./pages/CertificatesPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import ProfilePage from "./pages/ProfilePage";
import RegistrationsPage from "./pages/RegistrationsPage";
import { getStudentProfile, hasCompletedOnboarding } from "./utils/storage";

function ProtectedRoute({ children }) {
  return getStudentProfile() ? children : <Navigate to="/" replace />;
}

function OnboardingRoute() {
  if (!getStudentProfile()) {
    return <Navigate to="/" replace />;
  }

  if (hasCompletedOnboarding()) {
    return <Navigate to="/feed/all" replace />;
  }

  return <OnboardingPage />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/onboarding" element={<OnboardingRoute />} />
      <Route path="/feed" element={<Navigate to="/feed/all" replace />} />
      <Route
        path="/feed/:sectionId"
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clubs"
        element={
          <ProtectedRoute>
            <PlaceholderPage
              title="Club Directory"
              subtitle="Browse every student club as its own organized section."
              description="This page can later list full club profiles, coordinators, joining rules, and upcoming events."
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/registrations"
        element={
          <ProtectedRoute>
            <RegistrationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/certificates"
        element={
          <ProtectedRoute>
            <CertificatesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
