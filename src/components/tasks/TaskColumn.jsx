import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./Taskcard";

const columnColors = {
  Todo: "bg-red-500",
  InProgress: "bg-yellow-500",
  Expired: "bg-gray-500",
  Completed: "bg-green-500",
};

const TaskColumn = ({ title, tasks }) => {
  const { setNodeRef } = useDroppable({ id: title });

  // ✅ Sort tasks based on priority (High -> Medium -> Low)
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
  });

  return (
    <div ref={setNodeRef} className="w-1/4 p-4 rounded-lg shadow-md min-h-[400px] bg-gray-100">
      {/* Column Header */}
      <div className={`text-white text-lg font-semibold py-2 px-4 rounded-t-md ${columnColors[title]}`}>
        {title} <span className="bg-white text-black px-2 py-1 text-xs rounded-md ml-2">{tasks.length}</span>
      </div>

      {/* Task List */}
      <div className="mt-3 space-y-3 max-h-[450px] overflow-y-auto scrollbar-hidden">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))
        ) : (
          <p className="text-center text-gray-500">No tasks here</p>
        )}
      </div>
    </div>
  );
};


export default TaskColumn;
