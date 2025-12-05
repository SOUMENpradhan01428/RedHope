import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingFallback from "./components/LoadingFallback";

// Lazy load components for code splitting and better performance
const AdminDashboard = lazy(() => import("./pages/AdminDashboard/AdminDashboard"));
const DonorDashboard = lazy(() => import("./pages/DonorDashboard"));
const Hospital = lazy(() => import("./pages/Hospital"));
const Login = lazy(() => import("./pages/login"));

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/donor" element={<DonorDashboard />} />
        <Route path="/hospital" element={<Hospital />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Suspense>
  );
}
