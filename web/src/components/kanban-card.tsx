import { Draggable } from "react-beautiful-dnd";
import { Task } from "../services/tasks";
import Priority from "./priority";

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
