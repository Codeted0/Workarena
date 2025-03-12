import React from "react";

const DayWiseTasks = () => {
  const tasks = ["Task A", "Task B", "Task C", "Task D"];

  return (
    <div className="w-[248px] h-[220px] absolute right-[22px] top-[65%] bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 flex items-center">
        Day Wise
      </h3>

      {/* Scrollable Task List */}
      <div className="mt-2 space-y-4 max-h-[140px] justify-items-center overflow-y-scroll scrollbar-hidden">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="p-4 w-[180px]  bg-gradient-to-r from-purple-200 via-purple-100 to-blue shadow-lg rounded-lg text-gray-800 
                      transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
          >
            {task}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayWiseTasks;
