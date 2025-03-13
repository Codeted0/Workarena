import { useState, useRef, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

const TaskCard = ({ task }) => {
  const [expandedDesc, setExpandedDesc] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(task.completed || false);
  const [subtasks, setSubtasks] = useState(task.subtasks);
  const [isDraggingEnabled, setIsDraggingEnabled] = useState(false);
  const cardRef = useRef(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    disabled: !isDraggingEnabled,
  });

  // Close description when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setExpandedDesc(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle Dragging Mode on Double Click
  const handleDoubleClick = () => {
    setIsDraggingEnabled(!isDraggingEnabled);
  };

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onDoubleClick={handleDoubleClick}
      animate={{
        x: transform ? transform.x : 0,
        y: transform ? transform.y : 0,
        scale: isDragging ? 1.05 : 1,  // ✅ Slightly enlarge when dragging
        opacity: isDragging ? 0.7 : 1, // ✅ Fade effect during drag
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`border-l-4 p-4 rounded-lg mb-4 shadow-md transition ${
        isDragging ? "cursor-grabbing" : "cursor-pointer"
      } ${
        task.priority === "high"
          ? "border-red-500"
          : task.priority === "medium"
          ? "border-yellow-500"
          : "border-green-500"
      }`}
    >
      {/* Task Header */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-600">
          {task.startDate} - {task.endDate}
        </span>
        <CheckCircle
          className={`w-6 h-6 cursor-pointer transition ${
            taskCompleted ? "text-green-500" : "text-gray-400 hover:text-green-500"
          }`}
          onClick={() => setTaskCompleted(!taskCompleted)}
        />
      </div>

      {/* Task Title */}
      <h3 className="text-lg font-bold mt-2">{task.title}</h3>

      {/* Task Description with Read More */}
      <p className="text-sm text-gray-600 mt-1">
        {expandedDesc
          ? task.description
          : `${task.description.substring(0, 30)}...`}
        {task.description.length > 30 && (
          <button
            className="text-blue-500 text-xs ml-1"
            onClick={() => setExpandedDesc(true)}
          >
            Read More
          </button>
        )}
      </p>

      {/* Progress Bar */}
      <div className="mt-2 flex space-x-1">
        {subtasks.map((subtask, index) => (
          <div
            key={index}
            className={`h-2 w-6 rounded-full transition ${
              subtask.completed ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Subtasks Toggle */}
      <button
        className="flex items-center text-sm text-gray-600 mt-2"
        onClick={() => setShowSubtasks(!showSubtasks)}
      >
        {showSubtasks ? "Hide Subtasks" : "Show Subtasks"}
        {showSubtasks ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
      </button>

      {/* Subtasks List */}
      {showSubtasks && (
        <div className="mt-2 bg-gray-200 p-2 rounded-lg">
          {subtasks.map((subtask, index) => (
            <div key={index} className="flex justify-between items-center mb-1">
              <span className="text-sm">{subtask.title}</span>
              <CheckCircle
                className={`w-5 h-5 cursor-pointer transition ${
                  subtask.completed ? "text-green-500" : "text-gray-400 hover:text-green-500"
                }`}
                onClick={() => {
                  const updatedSubtasks = subtasks.map((sub, i) =>
                    i === index ? { ...sub, completed: !sub.completed } : sub
                  );
                  setSubtasks(updatedSubtasks);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TaskCard;
