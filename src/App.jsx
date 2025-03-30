import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { Analytics } from "@vercel/analytics/react"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import handAnimation from "./assets/handanimation.gif";

function App() {
  const [user, loading] = useAuthState(auth); // ✅ Handles authentication state

  if (loading) {
    return (
      // ✅ Show the Hand GIF while loading
      <div className="flex justify-center items-center h-screen bg-white">
        <img src={handAnimation} alt="Loading..." className="w-32 h-32" />
      </div>
    );
  }

  return (
    <AuthProvider>
      <Analytics/>
      <Router>
        <Routes>
          {/* 🔹 Home Page is the first page */}
          <Route path="/" element={<Home />} />

          {/* 🔹 Login & Register (Redirects to Dashboard after success) */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

          {/* 🔹 Dashboard (If user is not logged in, redirect to Home) */}
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
