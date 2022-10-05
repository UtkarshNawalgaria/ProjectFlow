import { useDroppable } from "@dnd-kit/core";
import { useState } from "react";

const KanbanList = ({
  children,
  listId,
}: {
  children: JSX.Element[];
  listId: number;
}) => {
  const [containerId] = useState(listId);
  const { setNodeRef, isOver, active } = useDroppable({
    id: listId,
    data: {
      listId: listId,
    },
  });
  const prevContainerId = active?.data?.current?.listId;

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
