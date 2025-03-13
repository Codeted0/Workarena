import { Plus, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ProfileSidebar from "./ProfileSidebar"; // Import Profile Sidebar

const Navbar = ({ setIsModalOpen, activePage }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);

  const pageTitles = {
    dashboard: "Dashboard",
    tasks: "Tasks",
    progress: "Progress",
    settings: "Settings",
  };

  const pageTitle = pageTitles[activePage] || "Dashboard";

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  return (
    <div className="relative">
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
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" /> Add Task
          </button>

          {/* Profile Icon - Toggles Sidebar */}
          <div
            ref={profileRef}
            className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-600 transition"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <User className="w-6 h-6 text-[#5A54B4]" />
          </div>
        </div>
      </div>

      {/* Profile Sidebar (Only Show When Open) */}
      {isProfileOpen && <ProfileSidebar />}
    </div>
  );
};

export default Navbar;
