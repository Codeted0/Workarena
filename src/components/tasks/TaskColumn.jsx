import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

const columnColors = {
  Todo: "bg-red-500",
  InProgress: "bg-yellow-500",
  Expired: "bg-gray-500",
  Completed: "bg-green-500",
};

const TaskColumn = ({ title, tasks }) => {
  const { setNodeRef } = useDroppable({ id: title });

  return (
    <div ref={setNodeRef} className="w-1/4 p-4 rounded-lg shadow-md min-h-[400px] bg-gray-100">
      <div className={`text-white text-lg font-semibold py-2 px-4 rounded-t-md ${columnColors[title]}`}>
        {title} <span className="bg-white text-black px-2 py-1 text-xs rounded-md ml-2">{tasks.length}</span>
      </div>
      <div className="mt-3 space-y-3">
        {tasks.map((task, index) => (
          <TaskCard key={task.id} task={task} index={index} />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;
