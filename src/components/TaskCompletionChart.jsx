import { PieChart, Pie, Cell } from "recharts";

const TaskCompletionChart = ({ completed, total }) => {
  const progress = (completed / total) * 100;
  const data = [
    { name: "Completed", value: progress },
    { name: "Remaining", value: 100 - progress },
  ];

  const COLORS = ["#7B61FF", "#EAEAEA"]; // Purple for progress, Light gray for remaining

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center w-full max-w-xs">
      {/* <p className="text-green-500 text-sm font-semibold">5.0% ↑</p> */}
      <h3 className="text-gray-800 text-xl  font-bold">Total Tasks</h3>
      <p className="text-3xl font-bold">{completed}/{total}</p>
      
      {/* Donut Chart Below the Text */}
      <PieChart width={120} height={120} className="mt-4">
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={50}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
};

export default TaskCompletionChart;
