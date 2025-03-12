import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardContent from "../components/DashboardContent";
import TasksPage from "../components/TasksPage"; // ✅ Import Tasks Page
import NewModalPopup from "../components/NewModalPopup";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("dashboard"); // ✅ Track the active page
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar with function to update active page */}
      <Sidebar setActivePage={setActivePage} activePage={activePage} />
      
      <div className="flex-1">
        {/* Navbar - Shows the active page name */}
        <Navbar activePage={activePage} setIsModalOpen={setIsModalOpen}  /> 

       {/* 🔹 Conditionally Render Dashboard or Tasks Page */}
       {activePage === "dashboard" && <DashboardContent />}
        {activePage === "tasks" && <TasksPage />}
        
        {/* Modal for Adding New Task */}
        <NewModalPopup isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
};

export default Dashboard;
