import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import streakIcon from "../assets/streak.png";
import coinIcon from "/coin.png";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";
import { doc, onSnapshot, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const ProfileSidebar = ({ onClose }) => {
  const { user } = useAuth();
  const sidebarRef = useRef(null);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    // 📌 🔥 Listen for real-time changes in Firestore
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setStreak(userData.streak || 0);
        setPoints(userData.points || 0);
      }
    });

    return () => unsubscribe(); // Unsubscribe when unmounting
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const checkAndUpdateStreak = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const lastActiveDate = userData.lastActiveDate || null;
        let currentStreak = userData.streak || 0;

        const today = dayjs().format("YYYY-MM-DD");
        const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

        if (lastActiveDate === today) {
          setStreak(currentStreak);
        } else if (lastActiveDate === yesterday) {
          currentStreak += 1;
          await updateDoc(userRef, { streak: currentStreak, lastActiveDate: today });
          setStreak(currentStreak);
        } else {
          await updateDoc(userRef, { streak: 0, lastActiveDate: today });
          setStreak(0);
        }
      }
    };

    checkAndUpdateStreak();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
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
        <div className="w-24 h-24 bg-gray-300 rounded-full mb-2"></div>
        <h2 className="text-xl font-bold">{user?.displayName || "User"}</h2>
        <span className="bg-gray-800 px-3 py-1 text-sm rounded-lg mt-1">{user?.profession || "Not Set"}</span>
        <p className="text-gray-300 mt-2">{user?.email || "No Email"}</p>
      </div>

       {/* Streak & Points Section */}
       <div className="bg-gradient-to-br from-purple-200 to-blue-200 text-gray-800 shadow-2xl p-4 mt-4 rounded-lg">
          <div className="flex items-center justify-between mt-2">
            {/* Streak */}
            <div className="flex flex-col items-center">
              <h4 className="text-lg font-medium  mb-2.5">Current Streak</h4>
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold">{streak}</span>
                <img src={streakIcon} alt="Streak Icon" className="w-10 h-10" />
              </div>
            </div>

            {/* Points */}
            <div className="flex flex-col items-center">
              <h4 className="text-lg font-medium mb-2.5">Total Points</h4>
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold">{points}</span>
                <img src={coinIcon} alt="Coin Icon" className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

      {/* ✏️ Edit Profile Button */}
      <button className="mt-4 w-full bg-gray-400 hover:bg-blue-600 text-white py-2 rounded-lg transition">
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileSidebar;
