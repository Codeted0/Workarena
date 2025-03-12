import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg p-10 bg-white rounded-xl shadow-xl">
        <h2 className="text-4xl font-bold text-center text-gray-700 mb-6">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-600 text-lg font-medium">Email</label>
            <input 
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring focus:border-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-lg font-medium">Password</label>
            <input 
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring focus:border-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-3 text-lg rounded-lg hover:bg-blue-600 transition duration-300">
            Login
          </button>
        </form>

        <p className="text-center text-lg text-gray-600 mt-6">
          Don't have an account?  
          <Link to="/register" className="text-blue-500 ml-1 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
