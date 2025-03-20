import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

import { useAuth } from "../context/AuthContext";

const NewModalPopup = ({ isOpen, onClose, task }) => {
  const { user } = useAuth();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("Todo"); // Default category
  const [priority, setPriority] = useState("Low");
  const [hasSubtasks, setHasSubtasks] = useState(false);
  const [subtasks, setSubtasks] = useState([
    { name: "", description: "", priority: "Low" },
  ]);

  // ✅ Pre-fill form when editing a task
  useEffect(() => {
    if (task) {
      setTaskTitle(task.title || "");
      setTaskDescription(task.description || "");
      setStartDate(task.startDate || "");
      setEndDate(task.endDate || "");
      setCategory(task.status || "Todo");
      setPriority(task.priority || "Low");
      setHasSubtasks(task.subtasks && task.subtasks.length > 0);
      setSubtasks(task.subtasks || []);
    } else {
      // Reset fields for adding a new task
      setTaskTitle("");
      setTaskDescription("");
      setStartDate("");
      setEndDate("");
      setCategory("Todo");
      setPriority("Low");
      setHasSubtasks(false);
      setSubtasks([{ name: "", description: "", priority: "Low" }]);
    }
  }, [task]);

  if (!isOpen) return null;

  // ✅ Add new subtask
  const addSubtask = () => {
    setSubtasks([...subtasks, { name: "", description: "", priority: "Low" }]);
  };

  // ✅ Remove a subtask
  const removeSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  // ✅ Ensure correct data before adding task
  const handleSaveTask = async () => {
    if (!taskTitle || !taskDescription || !startDate || !endDate || !user) {
      console.warn("⚠️ Missing task details!");
      return;
    }
  
    const updatedTask = {
      title: taskTitle,
      description: taskDescription,
      startDate,
      endDate,
      status: category.trim(),
      priority,
      subtasks: hasSubtasks ? subtasks : [],
    };
  
    try {
      if (task?.id) {
        // ✅ Updating an existing task
        const taskRef = doc(db, "users", user.uid, "tasks", task.id); // Ensure correct ID
        await updateDoc(taskRef, updatedTask);
        console.log("✅ Task Updated:", updatedTask);
      } else {
        // ✅ Adding a new task
        const tasksCollection = collection(db, "users", user.uid, "tasks");
        const docRef = await addDoc(tasksCollection, updatedTask);
        console.log("✅ New Task Added with ID:", docRef.id);
      }
  
      onClose(); // Close modal after save
    } catch (error) {
      console.error("🔥 Error saving task:", error);
    }
  };
  
  


  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">
          {task ? "Edit Task" : "Add New Task"}
        </h2>

        {/* Task Title & Description */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Task Title"
            className="w-1/2 p-2 border rounded"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            className="w-1/2 p-2 border rounded"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          />
        </div>

        {/* Start & End Date */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="font-semibold text-gray-700">From Date:</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              min={new Date().toISOString().split("T")[0]} // ✅ Set minimum date to today
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="w-1/2">
            <label className="font-semibold text-gray-700">To Date:</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              min={new Date().toISOString().split("T")[0]} // ✅ Set minimum date to today
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Category & Priority */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="font-semibold text-gray-700">Category:</label>
            <select
              className="w-full p-2 border rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Todo">To Do</option>
              <option value="InProgress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          <div className="w-1/2">
            <label className="font-semibold text-gray-700">Priority:</label>
            <select
              className="w-full text-gray-700 p-2 border rounded"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        {/* Subtask Section */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2 text-gray-700"
              checked={hasSubtasks}
              onChange={(e) => setHasSubtasks(e.target.checked)}
            />
            Any Subtasks?
          </label>
        </div>

        {/* Subtasks List */}
        {hasSubtasks && (
          <div className="p-4 border rounded mb-4 max-h-[200px] overflow-y-auto scrollbar-hidden">
            {subtasks.map((subtask, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Subtask Name"
                  className="w-1/3 p-2 border rounded"
                  value={subtask.name}
                  onChange={(e) => {
                    const newSubtasks = [...subtasks];
                    newSubtasks[index].name = e.target.value;
                    setSubtasks(newSubtasks);
                  }}
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="w-1/3 p-2 border rounded"
                  value={subtask.description}
                  onChange={(e) => {
                    const newSubtasks = [...subtasks];
                    newSubtasks[index].description = e.target.value;
                    setSubtasks(newSubtasks);
                  }}
                />
                {/* <select 
                  className="w-1/4 p-2 border text-gray-700 rounded" 
                  value={subtask.priority} 
                  onChange={(e) => {
                    const newSubtasks = [...subtasks];
                    newSubtasks[index].priority = e.target.value;
                    setSubtasks(newSubtasks);
                  }}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select> */}
                <button
                  className="px-2 text-red-500"
                  onClick={() => removeSubtask(index)}
                >
                  ✖
                </button>
              </div>
            ))}
            <button
              className="mt-2 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
              onClick={addSubtask}
            >
              + Add More
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            onClick={handleSaveTask}
          >
            {task ? "Update Task" : "Add Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewModalPopup;
