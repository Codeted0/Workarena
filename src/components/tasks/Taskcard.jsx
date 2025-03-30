import { useState, useRef, useEffect } from "react";

import { useDraggable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";

import {
  CheckCircle,
  Pencil,
  Trash,
  Pin,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from "lucide-react";
import { db } from "../../firebase";
import {
  doc,
  deleteDoc,
  updateDoc,
  increment,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import NewModalPopup from "../NewModalPopup";
// import { useRef } from "react";

const TaskCard = ({ task, onPinTask, onSubtaskToggle }) => {
  const { user } = useAuth();
  const [taskCompleted, setTaskCompleted] = useState(
    task?.status === "Completed"
  );
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // ✅ Track modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCoin, setShowCoin] = useState(false); // ✅ Control animation
  // ✅ Animation & Sound State
  // const [showCoin, setShowCoin] = useState(false);
  const coinAudio = useRef(null);

  const openEditModal = () => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  {
    isModalOpen && (
      <NewModalPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
      />
    );
  }
  // ✅ Animation & Sound State
  // ✅ Load Sound Effect on Mount
  useEffect(() => {
    coinAudio.current = new Audio("/addpoints.mp3"); // ✅ Make sure it's in `public/12-points.mp3`
    coinAudio.current.load();
  }, []);
  const playCoinSound = () => {
    coinAudio.current.currentTime = 0; // Reset sound to start
    coinAudio.current
      .play()
      .catch((error) => console.error("🔇 Sound error:", error));
  };

  // ✅ Play sound & show animation
  const triggerCoinEffect = () => {
    if (coinAudio.current) {
      coinAudio.current.currentTime = 0;
      coinAudio.current
        .play()
        .catch((err) => console.error("🔇 Sound error:", err));
    }

    setShowCoin(true);
    setTimeout(() => setShowCoin(false), 1000); // Hide animation after 1 second
  };
  // ✅ Convert Firestore subtasks object into an array (if needed)
  const formatSubtasks = (subtasks) => {
    if (!subtasks) return [];
    if (Array.isArray(subtasks)) return subtasks;
    return Object.values(subtasks);
  };

  const [subtasks, setSubtasks] = useState(formatSubtasks(task?.subtasks));

  // ✅ Make only the header draggable
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task?.id,
  });

  const updateStreak = async (userRef, lastActive, today) => {
    try {
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;
  
      const userData = userSnap.data();
      let newStreak = userData?.streak || 0;
  
      if (!lastActive || new Date(lastActive) < new Date(today).setDate(new Date(today).getDate() - 1)) {
        // 🔥 Reset streak if the user missed a day
        newStreak = 1;
      } else if (lastActive !== today) {
        // ✅ Increase streak if the lastActiveDate is not today
        newStreak += 1;
      }
  
      await updateDoc(userRef, {
        streak: newStreak,
        lastActiveDate: today,
      });
  
      console.log("🔥 Streak updated:", newStreak);
    } catch (error) {
      console.error("🔥 Error updating streak:", error.message);
    }
  };
  

  // ✅ Toggle Task Completion
  const toggleTaskCompletion = async () => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) return;
      const userData = userSnap.data();

      const today = new Date().toISOString().split("T")[0]; // 📅 YYYY-MM-DD format
      const lastActive = userData?.lastActiveDate || null;

      if (taskCompleted) {
        // 🔻 Marking as incomplete → Reduce points
        await updateDoc(doc(db, "users", user.uid, "tasks", task.id), {
          status: "Todo",
        });
        await updateDoc(userRef, { points: increment(-10) });
        setTaskCompleted(false);
      } else {
        // ✅ Marking as completed → Award points
        await updateDoc(doc(db, "users", user.uid, "tasks", task.id), {
          status: "Completed",
        });
        await updateDoc(userRef, { points: increment(10) });

        // 🔥 Update streak
        await updateStreak(userRef, lastActive, today);
        setTaskCompleted(true);
      }
    } catch (error) {
      console.error("🔥 Error updating task status:", error.message);
    }
  };


  // ✅ Toggle Subtask Completion
  const toggleSubtaskCompletion = async (index) => {
    const updatedSubtasks = [...subtasks];
    const subtask = updatedSubtasks[index];
  
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) return;
      const userData = userSnap.data();
  
      const today = new Date().toISOString().split("T")[0];
      const lastActive = userData?.lastActiveDate || null;
  
      // 🔄 Toggle completion status
      subtask.completed = !subtask.completed;
  
      // ✅ Update Firestore
      const taskRef = doc(db, "users", user.uid, "tasks", task.id);
      await updateDoc(taskRef, { subtasks: updatedSubtasks });
  
      // ✅ Adjust points
      await updateDoc(userRef, {
        points: increment(subtask.completed ? 5 : -5),
      });
  
      setSubtasks(updatedSubtasks);
  
      // ✅ Update streak only if subtask is marked completed
      if (subtask.completed) {
        await updateStreak(userRef, lastActive, today);
      }
    } catch (error) {
      console.error("🔥 Error updating subtask:", error.message);
    }
  };
  

  // ✅ Handle delete task
  const deleteTask = async () => {
    await deleteDoc(doc(db, "users", user.uid, "tasks", task.id));
  };

  // ✅ Handle pinning/unpinning task
  const togglePinTask = async () => {
    try {
      const newStatus = task.status === "Pinned" ? "Todo" : "Pinned";
      const taskRef = doc(db, "users", user.uid, "tasks", task.id);

      await updateDoc(taskRef, { status: newStatus });

      console.log(
        `📌 Task "${task.title}" ${
          newStatus === "Pinned" ? "Pinned" : "Unpinned"
        }!`
      );
    } catch (error) {
      console.error("🔥 Error pinning task:", error.message);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short" }; // Example: "15 Mar"
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  // console.log("🔥 Subtasks Data:", subtasks);
  return (
    <>
      <motion.div
        ref={setNodeRef}
        className={`border-l-4 p-4 rounded-lg mb-4 shadow-md transition ${
          isDragging ? "cursor-grabbing scale-105 opacity-80" : "cursor-pointer"
        } ${
          task?.priority === "High"
            ? "border-red-500"
            : task?.priority === "Medium"
            ? "border-yellow-500"
            : "border-green-500"
        }`}
      >
        {/* ✅ Draggable Header (Only this is draggable) */}
        <div
          className="flex justify-between items-center cursor-grab"
          {...listeners}
          {...attributes}
        >
          <span className="text-sm font-semibold text-gray-600">
            {task?.startDate ? formatDate(task.startDate) : ""} -{" "}
            {task?.endDate ? formatDate(task.endDate) : ""}
          </span>
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
        {/* ✅ Task Title */}
        <h3 className="text-lg font-bold mt-2">
          {task?.title || "Untitled Task"}
        </h3>
        <p className="text-sm text-gray-700 line-clamp-2">
          {task?.description || "No Description"}
        </p>
        {/* ✅ Task Completion */}
        <div className="flex justify-between items-center mt-2">
          <CheckCircle
            className={`w-6 h-6 cursor-pointer transition ${
              taskCompleted
                ? "text-green-500"
                : "text-gray-400 hover:text-green-500"
            }`}
            onClick={() => {
              toggleTaskCompletion();
              triggerCoinEffect(); // 🎯 Show Animation & Play Sound
            }}
          />
          {/* ✅ Coin Animation */}
          <AnimatePresence>
            {showCoin && (
              <motion.img
                src="/coin.png" // ✅ Your coin image must be inside `public/coin.png`
                alt="Coin"
                className="absolute w-8 h-8 left-1/2 top-0 transform -translate-x-1/2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1.5, y: -40 }}
                exit={{ opacity: 0, scale: 0, y: -80 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>

          {/* ✅ Task Actions */}
          <div className="space-x-2">
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={openEditModal}
            >
              <Pencil className="w-5 h-5" />
            </button>

            <button
              className="text-red-500 hover:text-red-700"
              onClick={deleteTask}
            >
              <Trash className="w-5 h-5" />
            </button>
            <button
              className="text-yellow-500 hover:text-yellow-700"
              onClick={() => onPinTask(task)}
            >
              <Pin className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* ✅ Subtask Progress Bar */}
        <div className="mt-2 flex space-x-1">
          {subtasks.length > 0 ? (
            subtasks.map((subtask, index) => (
              <div
                key={index}
                className={`h-2 w-6 rounded-full transition ${
                  subtask.completed ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500">No Subtasks</p>
          )}
        </div>
        {/* ✅ Toggle Subtasks Visibility */}
        {subtasks.length > 0 && (
          <button
            className="flex items-center text-sm text-gray-600 mt-2"
            onClick={() => setShowSubtasks(!showSubtasks)}
          >
            {showSubtasks ? "Hide Tasks" : "Show Tasks"}
            {showSubtasks ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </button>
        )}
        {/* ✅ Subtask List (Only shows if `showSubtasks` is true) */}
        {showSubtasks && (
          <div className="mt-2 bg-gray-200 text-sm p-2 rounded-lg">
            {subtasks.map((subtask, index) => (
              <div
                key={index}
                className="flex justify-between text-gray-700 items-center mb-1"
              >
                <span className="text-sm">
                  {subtask.name ? subtask.name : "Untitled Subtask"}
                </span>
                <CheckCircle
                  className={`w-5 h-5 cursor-pointer transition ${
                    subtask.completed
                      ? "text-green-500"
                      : "text-gray-400 hover:text-green-500"
                  }`}
                  onClick={() => toggleSubtaskCompletion(index)}
                />
              </div>
            ))}
          </div>
        )}
      </motion.div>
      {/* ✅ Show the same modal but for editing */}
      {isModalOpen && (
        <NewModalPopup
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={selectedTask}
        />
      )}
    </>
  );
};

export default TaskCard;
