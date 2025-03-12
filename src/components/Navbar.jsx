import { Plus, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = ({ setIsModalOpen, activePage}) => {
  // const location = useLocation();
  // const [pageTitle, setPageTitle] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // console.log("Current Path:", location.pathname);  // ✅ Debugging Line

    // const titles = {
    //   "/dashboard": "Dashboard",
    //   "/tasks": "Tasks",
    //   "/progress": "Progress",
    //   "/settings": "Settings",
    // };

    // setPageTitle(titles[location.pathname] || "WorkArena");

    // Update Current Date
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setCurrentDate(formattedDate);
  }, [location]);
  const pageTitles = {
    dashboard: "Dashboard",
    tasks: "Tasks",
    progress: "Progress",
    settings: "Settings",
  };

  const pageTitle = pageTitles[activePage] || "Dashboard"; // ✅ Default to Dashboard

  return (
    <div className="flex justify-between items-center bg-white text-[#5A54B4] px-6 py-4 shadow-lg">
      {/* Left Side: Page Title & Date */}
      <div>
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
        <p className="text-[#5A54B4]">{currentDate}</p>
      </div>

      {/* Right Side: Profile & Add Task */}
      <div className="flex items-center space-x-4">
        {/* Add Task Button */}
        <button
          className="bg-[#5A54B4] text-white shadow px-4 py-2 cursor-pointer rounded-lg flex items-center hover:bg-[#4a47a3] transition"
          onClick={() => setIsModalOpen(true)} // 🔹 Open modal when clicked
        >
          <Plus className="w-5 h-5 mr-2" /> Add Task
        </button>

        {/* Profile Circle */}
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-600 transition">
          <User className="w-6 h-6 text-[#5A54B4]" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
