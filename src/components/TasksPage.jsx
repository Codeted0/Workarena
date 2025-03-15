import { useState, useEffect } from "react";
import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core";
import TaskColumn from "./tasks/TaskColumn";
import TaskCard from "./tasks/Taskcard";
import { db } from "../firebase";
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState({ Todo: [], InProgress: [], Expired: [], Completed: [] });
  const [activeTask, setActiveTask] = useState(null);

  // 🔹 Fetch tasks in real-time
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(collection(db, "users", user.uid, "tasks"), (snapshot) => {
      let updatedTasks = { Todo: [], InProgress: [], Expired: [], Completed: [] };

      snapshot.forEach((doc) => {
        const taskData = doc.data();
        const status = taskData.status?.trim() || "Todo"; // ✅ Normalize status

        if (updatedTasks[status]) {
          updatedTasks[status].push({ id: doc.id, ...taskData });
        } else {
          console.warn(`⚠️ Unknown status "${taskData.status}" found in Firestore.`);
          updatedTasks["Todo"].push({ id: doc.id, ...taskData });
        }
      });

      console.log("🔄 Real-time Tasks Updated:", updatedTasks);
      setTasks(updatedTasks);
    });

    return () => unsubscribe();
  }, [user]);

  // ✅ Move task to "Completed" column when checked
  const handleTaskComplete = async (taskId) => {
    setTasks((prev) => {
      let updatedTasks = { ...prev };

      const fromColumn = Object.keys(prev).find((col) =>
        prev[col].some((task) => task.id === taskId)
      );

      if (!fromColumn) return prev; // Task not found

      const taskToMove = prev[fromColumn].find((task) => task.id === taskId);

      // ✅ Instantly update UI
      updatedTasks[fromColumn] = prev[fromColumn].filter((task) => task.id !== taskId);
      updatedTasks["Completed"] = [{ ...taskToMove, status: "Completed" }, ...prev["Completed"]];

      return updatedTasks;
    });

    // ✅ Update Firestore
    try {
      const taskRef = doc(db, "users", user.uid, "tasks", taskId);
      await updateDoc(taskRef, { status: "Completed" });

      console.log(`✅ Task "${taskId}" marked as completed!`);
    } catch (error) {
      console.error("🔥 Error completing task:", error.message);
    }
  };

  // 🔹 Drag Start Handler
  const handleDragStart = (event) => {
    const { active } = event;
    const task = Object.values(tasks).flat().find((t) => t.id === active.id);
    setActiveTask(task);
  };

  // 🔹 Drag End Handler (Fixes "snap back" illusion)
  const handleDragEnd = async (event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromColumn = Object.keys(tasks).find((col) => tasks[col].some((task) => task.id === active.id));
    const toColumn = over.id;

    if (!fromColumn || !toColumn || fromColumn === toColumn) return;

    const taskToMove = tasks[fromColumn].find((task) => task.id === active.id);

    // ✅ 🔹 Immediately update UI (Optimistic Update)
    setTasks((prev) => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter((task) => task.id !== active.id),
      [toColumn]: [{ ...taskToMove, status: toColumn }, ...prev[toColumn]],
    }));

    // ✅ 🔹 Update Firestore in the background
    try {
      const taskRef = doc(db, "users", user.uid, "tasks", taskToMove.id);
      await updateDoc(taskRef, { status: toColumn });

      console.log(`✅ Moved Task "${taskToMove.title}" → ${toColumn}`);
    } catch (error) {
      console.error("🔥 Error updating task status:", error.message);
    }
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Tasks</h1>

        <div className="flex gap-4">
          {Object.keys(tasks).map((column) => (
            <TaskColumn key={column} title={column} tasks={tasks[column]} onTaskComplete={handleTaskComplete} />
          ))}
        </div>
      </div>

      {/* ✅ Drag Overlay (Fix disappearing task) */}
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} onTaskComplete={handleTaskComplete} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TasksPage;
