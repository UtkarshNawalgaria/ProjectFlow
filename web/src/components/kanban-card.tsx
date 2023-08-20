import { Draggable } from "react-beautiful-dnd";
import { Task } from "../services/tasks";
import { capitalize } from "../utils";

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
          <div>
            <div
              className="mb-1 hover:text-indigo-500"
              onClick={() => openTask(task.id)}>
              {task.title}
            </div>
            <div className="text-sm text-gray-400 overflow-hidden break-all">
              {task.description}
            </div>
            <div>
              {task.priority ? <span>{capitalize(task.priority)}</span> : null}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default KanbanCard;
