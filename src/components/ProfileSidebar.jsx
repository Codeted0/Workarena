import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import streak from "../assets/streak.png";
import { useAuth } from "../context/AuthContext";

const ProfileSidebar = ({ onClose }) => {
  const { userData } = useAuth();
  const sidebarRef = useRef(null); // ✅ Reference for sidebar

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose(); // ✅ Close only when clicking OUTSIDE
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <>
      {/* 🟣 Profile Sidebar */}
      <div 
        ref={sidebarRef} 
        className="fixed top-[13%] right-0 w-80 h-[450px] bg-[#5A54B4] rounded-2xl text-white shadow-2xl p-5 z-50"
      >
        {/* ❌ Close Button */}
        <button className="absolute top-2 right-2 text-white hover:text-gray-300" onClick={onClose}>
          <X className="w-6 h-6" />
        </button>

        {/* 👤 User Info */}
        <div className="flex flex-col items-center mt-6">
          <div className="w-30 h-30 shadow-2xl bg-gray-300 rounded-full mb-2"></div>
          <h2 className="text-xl font-bold">{userData?.name || "User"}</h2>
          <span className="bg-gray-800 px-3 py-1 text-sm rounded-lg mt-1">{userData?.profession || "Not Set"}</span>
          <p className="text-gray-300 mt-2">{userData?.email || "No Email"}</p>
        </div>

        {/* 🔥 Streak Section */}
        <div className="bg-gradient-to-br from-purple-200 to-blue-200 text-gray-800 shadow-2xl p-4 mt-4 rounded-lg">
          <h3 className="text-md font-semibold">Current Streak</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-bold">2</span>
            <img src={streak} alt="Streak Icon" className="w-10 h-10" />
          </div>
        </div>

        {/* ✏️ Edit Profile Button */}
        <button className="mt-4 w-full bg-gray-400 hover:bg-blue-600 text-white py-2 rounded-lg transition">
          Edit Profile
        </button>
      </div>
    </>
  );
};

export default ProfileSidebar;
