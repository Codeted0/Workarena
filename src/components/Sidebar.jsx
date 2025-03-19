import { motion } from "framer-motion";
import { Home, ListChecks, Trophy, Settings, LogOut } from "lucide-react"; // ✅ Added LogOut icon
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ setActivePage, activePage }) => {
  const navigate = useNavigate();

  // 🔹 Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // ✅ Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <Home className="w-5 h-5 mr-3" />, page: "dashboard" },
    { name: "Tasks", icon: <ListChecks className="w-5 h-5 mr-3" />, page: "tasks" },
    { name: "Progress", icon: <Trophy className="w-5 h-5 mr-3" />, page: "progress" },
    { name: "Settings", icon: <Settings className="w-5 h-5 mr-3" />, page: "settings" },
  ];

  return (
    <div className="h-screen w-50 bg-[#5A54B4] text-white flex flex-col py-6 px-4 shadow-lg justify-between">
      {/* 🔹 Sidebar Top (Logo & Navigation) */}
      <div>
        <h1 className="text-2xl font-bold text-center mb-20">WorkArena</h1>

        <nav className="flex flex-col space-y-5 relative">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActivePage(item.page)}
              className={`relative flex items-center text-lg px-4 py-3 rounded-lg transition-all duration-300 ${
                activePage === item.page ? "text-white font-bold" : "text-gray-300"
              }`}
            >
              {item.icon}
              {item.name}

              {activePage === item.page && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 bg-white/15 rounded-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* 🔹 Logout Button at Bottom */}
      <button
        onClick={handleLogout}
        className="flex items-center text-lg px-4 py-3 mt-auto rounded-lg transition-all duration-300 hover:bg-red-600"
      >
        <LogOut className="w-5 h-5 mr-3" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
