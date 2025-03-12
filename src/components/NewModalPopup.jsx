import { useState } from "react";

const NewModalPopup = ({ isOpen, onClose }) => {
  const [hasSubtasks, setHasSubtasks] = useState(false);
  const [subtasks, setSubtasks] = useState([
    { name: "", description: "", priority: "" },
  ]);

  if (!isOpen) return null; // Hide modal if not open

  // Handle adding new subtask
  const addSubtask = () => {
    setSubtasks([...subtasks, { name: "", description: "", priority: "" }]);
  };

  // Handle removing a subtask
  const removeSubtask = (index) => {
    const updatedSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(updatedSubtasks);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Add New Task</h2>

        {/* Task Title & Description */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Task Title"
            className="w-1/2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            className="w-1/2 p-2 border rounded"
          />
        </div>

        {/* Start & End Date */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="font-semibold text-gray-700">From Date:</label>
            <input type="date" className="w-full p-2 border rounded" />
          </div>
          <div className="w-1/2">
            <label className="font-semibold text-gray-700">To Date:</label>
            <input type="date" className="w-full p-2 border rounded" />
          </div>
        </div>

        {/* Category & Priority */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="font-semibold text-gray-700">Category:</label>
            <div className="flex gap-2 mt-1">
              <button className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300">
                To Do
              </button>
              <button className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300">
                In Progress
              </button>
              <button className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300">
                Pinned
              </button>
            </div>
          </div>
          <div className="w-1/2">
            <label className="font-semibold text-gray-700">Priority:</label>
            <select className="w-full text-gray-700 p-2 border rounded">
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
              onChange={(e) => setHasSubtasks(e.target.checked)}
            />
            Any Subtasks?
          </label>
        </div>

        {/* Subtask Fields - Only show if checked */}
        {hasSubtasks && (
          <div className="p-4 border rounded mb-4 max-h-[200px] overflow-y-auto scrollbar-hidden">
            {subtasks.map((subtask, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Subtask Name"
                  className="w-1/3 p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Description"
                  className="w-1/3 p-2 border rounded"
                />
                <select className="w-1/4 p-2 border text-gray-700 rounded ">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
                <button
                  className="px-2 text-red-500"
                  onClick={() => removeSubtask(index)}
                >
                  ✖
                </button>
              </div>
            ))}
            <button
              className="mt-2 px-3 py-1  bg-purple-600 text-white rounded  hover:bg-purple-700"
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
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewModalPopup;
