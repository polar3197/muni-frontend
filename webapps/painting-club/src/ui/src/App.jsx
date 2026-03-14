import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/LandingPage/Login";
import UserProfile from "./components/UserProfile/UserProfile";
import LandingPage from "./components/LandingPage/LandingPage";
import "./styles/app-layout.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="landing-page" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/" element={<Navigate to="/landing-page" />} />
      </Routes>
    </BrowserRouter>
  );
}
