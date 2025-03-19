import { useState, useEffect } from "react";
import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core";
import TaskColumn from "./tasks/TaskColumn";
import TaskCard from "./tasks/Taskcard";
import { db } from "../firebase";
// import { collection, doc, setDoc } from "firebase/firestore";
import { collection, doc, updateDoc, onSnapshot, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState({
    Todo: [],
    InProgress: [],
    Expired: [],
    Completed: [],
    Pinned: [],
  });
  const [activeTask, setActiveTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTasks, setFilteredTasks] = useState(tasks);

  // 🔹 Fetch tasks & auto-move expired tasks
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "users", user.uid, "tasks"),
      async (snapshot) => {
        let updatedTasks = {
          Todo: [],
          InProgress: [],
          Expired: [],
          Completed: [],
        };
        const now = new Date();

        snapshot.forEach((doc) => {
          const taskData = doc.data();
          const status = taskData.status?.trim() || "Todo";
          const taskEndDate = taskData.endDate
            ? new Date(taskData.endDate)
            : null;

          // ✅ Ensure taskEndDate is valid
          if (
            taskEndDate &&
            !isNaN(taskEndDate) &&
            taskEndDate < now &&
            status !== "Completed"
          ) {
            updatedTasks["Expired"].push({
              id: doc.id,
              ...taskData,
              status: "Expired",
            });

            // ✅ Move to "Expired" in Firestore
            const taskRef = doc.ref;
            updateDoc(taskRef, { status: "Expired" })
              .then(() =>
                console.log(`⚠️ Task "${taskData.title}" moved to Expired!`)
              )
              .catch((error) =>
                console.error("🔥 Error updating expired task:", error)
              );
          } else {
            updatedTasks[status]?.push({ id: doc.id, ...taskData });
          }
        });

        console.log("🔄 Real-time Tasks Updated:", updatedTasks);
        setTasks(updatedTasks);
        setFilteredTasks(updatedTasks); // ✅ Ensure filteredTasks updates as well
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handlePinTask = async (task) => {
    if (!user) return;
  
    try {
      const taskCollectionRef = collection(db, "users", user.uid, "tasks");
      const newTaskRef = doc(taskCollectionRef); // Create a new document reference (new ID)
  
      // ✅ Create a COPY of the task with a new ID & set it to "Pinned"
      await setDoc(newTaskRef, {
        ...task,
        id: newTaskRef.id, // ✅ Set the new document ID
        status: "Pinned", // ✅ Keep the original task unchanged
      });
  
      console.log(`📌 Task "${task.title}" copied to Pinned!`);
    } catch (error) {
      console.error("🔥 Error pinning task:", error.message);
    }
  };
  

  // ✅ Search Function
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredTasks(tasks);
    } else {
      let filtered = { Todo: [], InProgress: [], Expired: [], Completed: [] };

      Object.keys(tasks).forEach((status) => {
        filtered[status] = tasks[status].filter(
          (task) =>
            task.title?.toLowerCase().includes(query.toLowerCase()) ||
            task.description?.toLowerCase().includes(query.toLowerCase()) ||
            (task.subtasks &&
              task.subtasks.some((sub) =>
                sub.name.toLowerCase().includes(query.toLowerCase())
              ))
        );
      });

      setFilteredTasks(filtered);
    }
  };

  // 🔹 Drag Start Handler
  const handleDragStart = (event) => {
    const { active } = event;
    const task = Object.values(tasks)
      .flat()
      .find((t) => t.id === active.id);
    setActiveTask(task);
  };

  // 🔹 Drag End Handler (Fixes "snap back" issue)
  const handleDragEnd = async (event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromColumn = Object.keys(tasks).find((col) =>
      tasks[col].some((task) => task.id === active.id)
    );
    const toColumn = over.id;

    if (!fromColumn || !toColumn || fromColumn === toColumn) return;

    const taskToMove = tasks[fromColumn].find((task) => task.id === active.id);

    // ✅ Instantly update UI (Optimistic Update)
    const newTasks = {
      ...tasks,
      [fromColumn]: tasks[fromColumn].filter((task) => task.id !== active.id),
      [toColumn]: [{ ...taskToMove, status: toColumn }, ...tasks[toColumn]],
    };

    setTasks(newTasks);
    setFilteredTasks(newTasks);

    // ✅ Update Firestore
    try {
      const taskRef = doc(db, "users", user.uid, "tasks", taskToMove.id);
      await updateDoc(taskRef, { status: toColumn });

      console.log(`✅ Moved Task "${taskToMove.title}" → ${toColumn}`);
    } catch (error) {
      console.error("🔥 Error updating task status:", error.message);
    }
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-6">
        {/* 🔎 Search Bar */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="p-2 border-2 border-[#5A54B4] rounded w-1/2"
          />
          <button
            onClick={() => {
              setSearchQuery("");
              setFilteredTasks(tasks);
            }}
            className="bg-[#5A54B4] text-white px-4 py-2 rounded"
          >
            Show All Tasks
          </button>
        </div>

        {/* 📌 Task Columns */}
        <div className="flex gap-4">
          {Object.keys(filteredTasks).map((column) => (
           <TaskColumn
           key={column}
           title={column}
           tasks={filteredTasks[column]}
           onPinTask={handlePinTask} // ✅ Pass handlePinTask as a prop
         />
          ))}
        </div>
      </div>

      {/* ✅ Drag Overlay (Fix disappearing task) */}
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TasksPage;
