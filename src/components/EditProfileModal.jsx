import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // ✅ Import Firebase
import { doc, getDoc } from "firebase/firestore";

const ProfileSidebar = ({ onClose }) => {
  const [userData, setUserData] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser; // ✅ Get current logged-in user
      if (!user) return;

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          console.warn("⚠️ No user data found in Firestore!");
        }
      } catch (error) {
        console.error("🔥 Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      {/* Sidebar */}
      <div className="fixed top-[13%] right-0 w-80 h-[450px] bg-[#5A54B4] rounded-2xl text-white shadow-2xl p-5 transition-transform transform translate-x-0 z-50">
        {/* Close Button */}
        <button className="absolute top-2 right-2 text-white hover:text-gray-300" onClick={onClose}>
          <X className="w-6 h-6" />
        </button>

        {/* User Info */}
        <div className="flex flex-col items-center mt-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full mb-2"></div>
          <h2 className="text-xl font-bold">{userData?.name || "User"}</h2>
          <span className="bg-gray-800 px-3 py-1 text-sm rounded-lg mt-1">
            {userData?.profession || "No Profession"}
          </span>
          <p className="text-gray-300 mt-2">{userData?.email || "No Email"}</p>
        </div>

        {/* Streak Section */}
        <div className="bg-gradient-to-br from-purple-200 to-blue-200 text-gray-800 shadow-2xl p-4 mt-4 rounded-lg">
          <h3 className="text-md font-semibold">Current Streak</h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-bold">2</span>
            <img src="/flame-icon.png" alt="Streak Icon" className="w-10 h-10" />
          </div>
        </div>

        {/* Edit Profile Button */}
        <button
          className="mt-4 w-full bg-gray-400 hover:bg-blue-600 text-white py-2 rounded-lg transition"
          onClick={() => setIsEditOpen(true)}
        >
          Edit Profile
        </button>
      </div>
    </>
  );
};

export default ProfileSidebar;
