import { useState } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import TaskColumn from "./tasks/TaskColumn";
import { GripHorizontal, X } from "lucide-react";

const initialTasks = {
  Todo: [
    {
      id: "1",
      title: "Design Homepage",
      description: "Create homepage UI",
      priority: "high",
      startDate: "23 Mar",
      endDate: "24 Mar",
      subtasks: [
        { title: "Header Design", completed: false },
        { title: "Footer Design", completed: true },
      ],
    },
  ],
  InProgress: [],
  Expired: [],
  Completed: [],
};

const TasksPage = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [dragEnabled, setDragEnabled] = useState(true); // ✅ Toggle Drag & Drop

  // ✅ Drag End Function
  const handleDragEnd = (event) => {
    if (!dragEnabled) return; // Disable drag if toggle is OFF

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromColumn = Object.keys(tasks).find((col) =>
      tasks[col].some((task) => task.id === active.id)
    );
    const toColumn = over.id;

    if (!fromColumn || !toColumn || fromColumn === toColumn) return;

    const taskToMove = tasks[fromColumn].find((task) => task.id === active.id);

    setTasks((prev) => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter((task) => task.id !== active.id),
      [toColumn]: [...prev[toColumn], taskToMove],
    }));
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Tasks</h1>
          
          {/* ✅ Drag Toggle Button */}
          <button
            onClick={() => setDragEnabled(!dragEnabled)}
            className="bg-[#5A54B4] text-white px-4 py-2 rounded-lg flex items-center"
          >
            {dragEnabled ? <X className="w-5 h-5 mr-2" /> : <GripHorizontal className="w-5 h-5 mr-2" />}
            {dragEnabled ? "Disable Drag" : "Enable Drag"}
          </button>
        </div>

        <div className="flex gap-4">
          {Object.keys(tasks).map((column) => (
            <TaskColumn key={column} title={column} tasks={tasks[column]} dragEnabled={dragEnabled} />
          ))}
        </div>
      </div>
    </DndContext>
  );
};

export default TasksPage;
