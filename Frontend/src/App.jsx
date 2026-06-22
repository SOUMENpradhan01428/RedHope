import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoadingFallback from "./components/LoadingFallback";

const AdminDashboard = lazy(() => import("./pages/AdminDashboard/AdminDashboard"));
const DonorDashboard = lazy(() => import("./pages/DonorDashboard/DonorDashboard"));
const Hospital = lazy(() => import("./pages/Hospital/Hospital"));
const Login = lazy(() => import("./pages/login.jsx"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Notifications = lazy(() => import("./pages/Notifications/Notifications"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Messages = lazy(() => import("./pages/Messages/Messages"));
const WelcomeScreen = lazy(() => import("./pages/Welcome/WelcomeScreen"));

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingFallback />;
  if (!user) return <Navigate to="/" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

import { Toaster } from "react-hot-toast";

export default function App() {
  const { user, loading } = useAuth();

  const getRedirectPath = () => {
    if (sessionStorage.getItem("showWelcome") === "true") return "/welcome";
    return `/${user.role.toLowerCase()}`;
  };

  return (
    <>
      <Toaster position="top-right" />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
        <Route
          path="/"
          element={!loading && user ? <Navigate to={getRedirectPath()} /> : <LandingPage />}
        />
        <Route
          path="/login"
          element={!loading && user ? <Navigate to={getRedirectPath()} /> : <Login />}
        />
        <Route path="/welcome" element={<ProtectedRoute><WelcomeScreen /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/donor" element={<ProtectedRoute allowedRoles={["Donor"]}><DonorDashboard /></ProtectedRoute>} />
        <Route path="/hospital" element={<ProtectedRoute allowedRoles={["Hospital"]}><Hospital /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={["Donor", "Hospital"]}><Profile /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute allowedRoles={["Donor", "Hospital"]}><Messages /></ProtectedRoute>} />
      </Routes>
    </Suspense>
    </>
  );
}
