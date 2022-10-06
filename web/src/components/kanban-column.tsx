import { useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import { TaskList } from "../services/tasks";

const KanbanList = ({
  children,
  tasklist,
}: {
  children: JSX.Element[];
  tasklist: TaskList;
}) => {
  const [containerId] = useState(tasklist.id);
  const { setNodeRef, isOver, active } = useDroppable({
    id: tasklist.id,
    data: {
      tasklist: tasklist,
    },
  });

  const prevContainerId = active?.data?.current?.list.id;

  return (
    <div ref={setNodeRef} className="rounded-md mt-10 h-full bg-gray-50">
      <div>{children}</div>
      {isOver && prevContainerId !== containerId ? (
        <div className="p-4 bg-white border-dashed border-1 rounded-md mx-4 text-center text-gray-500 shadow-inner">
          Drop Here
        </div>
      ) : null}
    </div>
  );
};

export default KanbanList;
