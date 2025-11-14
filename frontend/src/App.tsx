import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import Hospital from "./pages/Hospital";
import Login from "./pages/login";

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/donor" element={<DonorDashboard />} />
      <Route path="/hospital" element={<Hospital />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
}
