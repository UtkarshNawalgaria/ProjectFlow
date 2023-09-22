import { Draggable } from "react-beautiful-dnd";
import { Task } from "../services/tasks";
import { capitalize } from "../utils";

function Priority({ value }: { value: Task["priority"] }) {
  if (!value) return null;

  let bgColor, iconColor;

  switch (value) {
    case "low":
      bgColor = "bg-yellow-100/40";
      iconColor = "bg-yellow-500";
      break;
    case "medium":
      bgColor = "bg-green-100/40";
      iconColor = "bg-green-500";
      break;
    case "high":
      bgColor = "bg-red-100/40";
      iconColor = "bg-red-500";
      break;
  }

  return (
    <div
      className={`mt-1 rounded-md px-2 text-sm py-1 flex items-center gap-2 w-min ${bgColor}`}>
      <span
        className={`w-[13px] h-[13px] inline-block bg-white rounded-full ${iconColor}`}></span>
      <span>{capitalize(value)}</span>
    </div>
  );
}

function KanbanCard({
  task,
  index,
  openTask,
}: {
  task: Task;
  index: number;
  openTask: (taskId: number) => void;
}) {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 bg-slate-800 text-gray-100 mb-4 rounded-md shadow-md w-full text-left`}>
          <div className="flex flex-col gap-1">
            <div
              className="hover:text-indigo-500"
              onClick={() => openTask(task.id)}>
              {task.title}
            </div>
            <div className="text-sm text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap">
              {task.description}
            </div>
            <Priority value={task.priority} />
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default KanbanCard;
