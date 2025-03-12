import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./Taskcard";

const TaskColumn = ({ title, tasks, columnId }) => {
  return (
    <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md min-h-[300px] w-full">
        <h3 className="text-lg font-semibold mb-3 capitalize text-gray-700">
          {title}
        </h3>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </SortableContext>
  );
};

export default TaskColumn;
