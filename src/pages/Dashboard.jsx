import { useState } from "react";
import { motion } from "framer-motion";
import DashboardContent from "../components/DashboardContent";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import NewModalPopup from "../components/NewModalPopup";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);

//   const renderContent = () => {
//     switch (activePage) {
//       case "tasks":
//         return <h2 className="text-2xl">📋 Tasks Section</h2>;
//       case "progress":
//         return <h2 className="text-2xl">📊 Progress Tracking</h2>;
//       case "settings":
//         return <h2 className="text-2xl">⚙️ Settings</h2>;
//       default:
//         return <h2 className="text-2xl">🏠 Home</h2>;
//     }
//   };

  return (
    // <div className="flex min-h-screen bg-gradient-to-br from-purple-200 to-blue-200">
    <div className="flex min-h-screen ">
      <Sidebar setActivePage={setActivePage} />
      <div className="flex-1 ">
      <Navbar setIsModalOpen={setIsModalOpen} />  {/* 🔹 Pass modal control to Navbar */}
      <DashboardContent isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <NewModalPopup isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        {/* Add other dashboard content below */}
      </div>
    
    </div>
  );
};

export default Dashboard;
