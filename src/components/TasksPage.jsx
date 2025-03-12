import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import TaskColumn from "./tasks/TaskColumn";

const initialTasks = {
  todo: [{ id: "1", title: "Design Homepage", priority: "High" }],
  inProgress: [{ id: "2", title: "Develop API", priority: "Medium" }],
  expired: [{ id: "3", title: "Fix Login Bug", priority: "Low" }],
  completed: [{ id: "4", title: "Create Wireframe", priority: "Medium" }],
};

const TasksPage = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const updatedTasks = { ...tasks };
    Object.keys(updatedTasks).forEach((columnId) => {
      const indexFrom = updatedTasks[columnId].findIndex((task) => task.id === active.id);
      if (indexFrom !== -1) {
        const taskToMove = updatedTasks[columnId].splice(indexFrom, 1)[0];
        updatedTasks[over.id].push(taskToMove);
      }
    });

    setTasks(updatedTasks);
  };

  return (
    <div className="p-6">
      {/* Header with Search & Add Task */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#5A54B4]">Tasks</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5A54B4]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="bg-[#5A54B4] text-white px-4 py-2 rounded-lg flex items-center hover:bg-[#4a47a3]">
            <Plus className="w-5 h-5 mr-2" /> Add Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4">
          <TaskColumn title="To-Do" tasks={tasks.todo} columnId="todo" />
          <TaskColumn title="In Progress" tasks={tasks.inProgress} columnId="inProgress" />
          <TaskColumn title="Expired" tasks={tasks.expired} columnId="expired" />
          <TaskColumn title="Completed" tasks={tasks.completed} columnId="completed" />
        </div>
      </DndContext>
    </div>
  );
};

export default TasksPage;
