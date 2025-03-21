import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase"; // ✅ Import Firebase
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState(""); // ✅ New state for gender
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // ✅ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Update user's profile with name
      await updateProfile(user, { displayName: name });

      console.log("✅ User registered:", user.uid);

      // ✅ Store user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        gender: gender,  // ✅ Store gender
        createdAt: new Date().toISOString(),
      });

      console.log("✅ User data saved in Firestore");

      // ✅ Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("🔥 Registration Error:", error);
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
              placeholder="Enter your password"
              className="w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring focus:border-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* ✅ Gender Dropdown */}
          <div>
            <label className="block text-gray-600 text-lg font-medium">Gender</label>
            <select
              className="w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring focus:border-green-400"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Register Button */}
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
