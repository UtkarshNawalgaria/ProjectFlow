import { useDraggable } from "@dnd-kit/core";
import { Task, TaskList } from "../services/tasks";

function KanbanCard({
  children,
  task,
  list,
}: {
  children: JSX.Element;
  task: Task;
  list: TaskList;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: {
        list: list,
      },
    });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  const draggingContainerStyle =
    "bg-white border-dashed border-1 rounded-md shadow-inner";

  return (
    <div className={`${isDragging ? draggingContainerStyle : ""}`}>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        className={`p-4 bg-white text-gray-900 mb-4 rounded-md shadow-md ${
          isDragging ? "opacity-90" : null
        }`}>
        {children}
      </div>
    </div>
  );
}

export default KanbanCard;
