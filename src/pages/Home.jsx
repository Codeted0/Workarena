import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to WorkArena 🎯</h1>
      <p className="text-lg text-center max-w-2xl">
        Track your tasks, earn points, and stay motivated to complete your goals!
      </p>

      <div className="mt-6 flex space-x-4">
        <Link to="/login" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
          Login
        </Link>
        <Link to="/register" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
          Register
        </Link>
      </div>

      <div className="mt-10 max-w-4xl">
        <h2 className="text-2xl font-semibold mb-3">Why Use WorkArena?</h2>
        <ul className="text-lg list-disc list-inside">
          <li>✔ Track your daily tasks effortlessly</li>
          <li>✔ Earn points & build streaks</li>
          <li>✔ Stay organized & improve productivity</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
