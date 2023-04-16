import { Draggable } from "react-beautiful-dnd";
import { Task } from "../services/tasks";
import { capitalize } from "../utils";

function KanbanCard({ task, index }: { task: Task; index: number }) {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 bg-white text-gray-900 mb-4 rounded-md shadow-md w-full text-left`}>
          <div>
            <div className="mb-1 hover:text-indigo-500">{task.title}</div>
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
