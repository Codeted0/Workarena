import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TaskCard = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white p-3 rounded-lg shadow-md mb-2 flex justify-between"
    >
      <span>{task.title}</span>
      <span
        className={`text-xs px-2 py-1 rounded-lg ${
          task.priority === "High"
            ? "bg-red-500 text-white"
            : task.priority === "Medium"
            ? "bg-yellow-500 text-white"
            : "bg-green-500 text-white"
        }`}
      >
        {task.priority}
      </span>
    </div>
  );
};

export default TaskCard;
