import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import LoginPage from "./app/login/LoginPage";
import RegisterPage from "./app/login/RegisterPage";
import ProfilPage from "./pages/ProfilPage";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/dashboard";
import Guide from "@/components/Guide";
import AdminDashboard from "./pages/AdminDashboard";

// Composants
import StatsDashboard from "./components/StatsDashboard";


// Styles globaux
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        {/* Définition des routes principales */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profil" element={<ProfilPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/statistics" element={<StatsDashboard />} />
           <Route path="/guide" element={<Guide />} /> 
           <Route path="/adminDashboard" element={<AdminDashboard />} />
  
        </Routes>
       
      </div>
    </Router>
  );
}

export default App;
