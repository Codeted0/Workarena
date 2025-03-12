import { motion } from "framer-motion";
import { Home, ListChecks, Trophy, Settings } from "lucide-react"; // ✅ Correct

const Sidebar = ({ setActivePage, activePage }) => {
  const menuItems = [
    { name: "Dashboard", icon: <Home className="w-5 h-5 mr-3" />, page: "dashboard" },
    { name: "Tasks", icon: <ListChecks className="w-5 h-5 mr-3" />, page: "tasks" },
    { name: "Progress", icon: <Trophy className="w-5 h-5 mr-3" />, page: "progress" },
    { name: "Settings", icon: <Settings className="w-5 h-5 mr-3" />, page: "settings" },
  ];

  return (
    <div className="h-screen w-50 bg-[#5A54B4] text-white flex flex-col py-6 px-4 shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-20">WorkArena</h1>

      <nav className="flex flex-col space-y-5 relative">
      {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActivePage(item.page)} // ✅ Switch page
            className={`relative flex items-center text-lg px-4 py-3 rounded-lg transition-all duration-300 ${
               activePage === item.page ? "text-white font-bold" : "text-gray-300"
            }`}
          >
            {item.icon}
            {item.name}

            {/* Highlight Indicator Animation */}
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
  );
};

export default Sidebar;
