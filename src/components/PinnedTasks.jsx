const PinnedTasks = () => {
  const tasks = [
    { title: "Design Meeting", description: "Discuss UI updates & branding" },
    { title: "Code Review", description: "Check PRs and suggest improvements" },
    { title: "Sprint Planning", description: "Plan tasks for the next sprint" },
    { title: "Sprint Planning", description: "Plan tasks for the next sprint" },
    { title: "Client Presentation", description: "Prepare slides & demo" },
    { title: "Bug Fixing", description: "Resolve reported issues" },
  ];

  return (
    <div className="bg-white h-auto p-2 rounded-lg shadow-[0_20px_20px_rgba(0,0,0,0.25)]">
      <h3 className="text-xl font-bold flex items-center">Pinned Tasks</h3>
      
      {/* Scrollable Task List */}
      <div className="mt-4 space-y-4 overflow-y-auto max-h-[340px] justify-items-center pr-2 scrollbar-hidden">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-purple-200 via-purple-100 to-white p-4 w-[450px] rounded-xl shadow-md flex justify-between items-center 
                      transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div>
              <h4 className="font-semibold text-gray-800">{task.title}</h4>
              <p className="text-gray-600 text-sm">{task.description}</p>
            </div>
            <button className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 transition">
              ➜
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PinnedTasks;
