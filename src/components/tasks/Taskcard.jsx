import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
// import { GripVertical } from "lucide-react"; // Ensure you have the correct import
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
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import NewModalPopup from "../NewModalPopup";

const TaskCard = ({ task, onPinTask, onSubtaskToggle }) => {
  const { user } = useAuth();
  const [taskCompleted, setTaskCompleted] = useState(
    task?.status === "Completed"
  );
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // ✅ Track modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

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

  // ✅ Handle task completion
  const toggleTaskCompletion = async () => {
    if (taskCompleted) return; // Already completed

    try {
      const taskRef = doc(db, "users", user.uid, "tasks", task.id);

      // ✅ Update Firestore
      await updateDoc(taskRef, { status: "Completed" });

      setTaskCompleted(true); // ✅ Update UI instantly
      console.log(`✅ Task "${task.title}" marked as completed!`);
    } catch (error) {
      console.error("🔥 Error completing task:", error.message);
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
            onClick={toggleTaskCompletion}
          />

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
        {/* ✅ Toggle Subtasks */}
        {subtasks.length > 0 && (
          <button
            className="flex items-center text-sm text-gray-600 mt-2"
            onClick={() => setShowSubtasks(!showSubtasks)}
          >
            {showSubtasks ? "Hide Subtasks" : "Show Subtasks"}
            {showSubtasks ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </button>
        )}
        {/* ✅ Subtasks List */}
        {showSubtasks && (
          <div className="mt-2 bg-gray-200 p-2 rounded-lg">
            {subtasks.map((subtask, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-1"
              >
                <span className="text-sm">
                  {subtask?.title || "Untitled Subtask"}
                </span>
                <CheckCircle
                  className={`w-5 h-5 cursor-pointer transition ${
                    subtask.completed
                      ? "text-green-500"
                      : "text-gray-400 hover:text-green-500"
                  }`}
                  onClick={() => onSubtaskToggle(task.id, index)} // ✅ Call function correctly
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
