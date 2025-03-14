import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { updateProfile } from "firebase/auth";

const Register = () => {
  const [name, setName] = useState("");  // Added name field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // ✅ Pass name to register() function
      const userCredential = await register(email, password, name);
  
      navigate("/login"); // Redirect after successful registration
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg p-10 bg-white rounded-xl shadow-xl">
        <h2 className="text-4xl font-bold text-center text-gray-700 mb-6">Register</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-gray-600 text-lg font-medium">Full Name</label>
            <input 
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring focus:border-green-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-gray-600 text-lg font-medium">Email</label>
            <input 
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring focus:border-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-600 text-lg font-medium">Password</label>
            <input 
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring focus:border-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-green-500 text-white py-3 text-lg rounded-lg hover:bg-green-600 transition duration-300">
            Register
          </button>
        </form>

        <p className="text-center text-lg text-gray-600 mt-6">
          Already have an account?  
          <Link to="/login" className="text-blue-500 ml-1 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
