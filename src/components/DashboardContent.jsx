import CalendarWidget from "./CalendarWidget";
import girlImage from "../assets/girl.png";
import PinnedTasks from "./PinnedTasks";
import TaskCompletionChart from "./TaskCompletionChart";
import DayWiseTasks from "./DayWiseTasks";

const DashboardContent = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col p-6">
      <div className="grid grid-cols-4 grid-rows-4 gap-4 row-gap-10 h-full overflow-hidden">
        {/* Greeting Section */}
        <div className="col-span-3 row-span-1 bg-gradient-to-br from-purple-200 to-blue-200 p-6 rounded-lg shadow-xl flex items-center justify-between">
          <div>
            <h2 className="text-4xl text-black mb-1.5 font-bold">HI GIRLIE!</h2>
            <p className="text-black">New day, Start with something better!</p>
          </div>
          <div className="w-44 h-44 absolute top-0 right-[300px] flex mt-[80px] items-center justify-center">
            <img src={girlImage} alt="Girl Waving" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Calendar Section */}
        <div className="col-span-1 row-span-2 flex justify-end">
          <CalendarWidget />
        </div>

        {/* Pinned Tasks */}
        <div className="col-span-2">
          <PinnedTasks />
        </div>

        {/* Chart Section */}
        <div className="col-span-1">
          <TaskCompletionChart completed={7} total={10} />
        </div>

        <DayWiseTasks />
      </div>
    </div>
  );
};

export default DashboardContent;
