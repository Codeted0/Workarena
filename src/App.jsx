import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Loading...</p>;

  return (
    <AuthProvider>
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
