import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Pin } from "lucide-react";

const PinnedTasks = () => {
  const { user } = useAuth();
  const [pinnedTasks, setPinnedTasks] = useState([]);

  // ✅ Fetch pinned tasks in real-time from Firestore
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "users", user.uid, "tasks"),
      (snapshot) => {
        const pinned = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((task) => task.status === "Pinned"); // ✅ Filter only pinned tasks

        setPinnedTasks(pinned);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // ✅ Function to Unpin a Task
  const togglePinTask = async (taskId) => {
    try {
      const taskRef = doc(db, "users", user.uid, "tasks", taskId);
      await updateDoc(taskRef, { status: "Todo" });

      console.log(`📌 Task "${taskId}" unpinned and moved back to Todo.`);
    } catch (error) {
      console.error("🔥 Error unpinning task:", error.message);
    }
  };

  return (
    <div className="bg-white h-auto p-2 rounded-lg shadow-[0_20px_20px_rgba(0,0,0,0.25)]">
      <h3 className="text-xl font-bold flex items-center">Pinned Tasks</h3>

      {/* Scrollable Task List */}
      <div className="mt-4 space-y-4 overflow-y-auto max-h-[340px] justify-items-center pr-2 scrollbar-hidden">
        {pinnedTasks.length > 0 ? (
          pinnedTasks.map((task) => (
            <div
              key={task.id}
              className="bg-gradient-to-r from-purple-200 via-purple-100 to-white p-4 w-[450px] rounded-xl shadow-md flex justify-between items-center 
                        transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div>
                <h4 className="font-semibold text-gray-800">{task.title}</h4>
                <p className="text-gray-600 text-sm">{task.description}</p>
              </div>

              {/* Unpin Button */}
              <button
                className={`p-2 rounded-full transition ${
                  task.status === "Pinned"
                    ? "bg-purple-500 text-white hover:bg-purple-700"
                    : "text-purple-500 hover:text-purple-700"
                }`}
                onClick={togglePinTask}
              >
                {task.status === "Pinned" ? (
                  <Pin className="w-5 h-5 rotate-45" />
                ) : (
                  <Pin className="w-5 h-5" />
                )}
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-4">No pinned tasks.</p>
        )}
      </div>
    </div>
  );
};

export default PinnedTasks;
