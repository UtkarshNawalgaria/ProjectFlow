import { useDroppable } from "@dnd-kit/core";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useUser, { TUserContext } from "../context/UserProvider";
import { TaskCreate, TaskList } from "../services/tasks";
import Button from "./button";

const KanbanList = ({
  children,
  tasklist,
  addNewTask,
}: {
  children: JSX.Element[];
  tasklist: TaskList;
  addNewTask: (task: TaskCreate) => void;
}) => {
  const { projectId } = useParams();
  const { user } = useUser() as TUserContext;
  const [containerId] = useState(tasklist.id);
  const newTaskRef = useRef<HTMLInputElement>(null);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const { setNodeRef, isOver, active } = useDroppable({
    id: tasklist.id,
    data: {
      tasklist: tasklist,
    },
  });
  const prevContainerId = active?.data?.current?.list.id;

  const handleCreateNewTask = () => {
    if (newTaskRef !== null) {
      addNewTask({
        title: newTaskRef.current?.value as string,
        project: parseInt(projectId as string),
        tasklist: containerId,
        owner: user?.id as number,
      });
      setShowNewTaskForm(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="rounded-md h-full bg-gray-50 flex flex-col justify-between">
      <div>
        <div>{children}</div>
        {isOver && prevContainerId !== containerId ? (
          <div className="p-4 bg-white border-dashed border-1 rounded-md mx-4 text-center text-gray-500 shadow-inner">
            Drop Here
          </div>
        ) : null}
      </div>
      <div className="mb-4">
        {showNewTaskForm ? (
          <div className="px-4">
            <div>
              <input
                type="text"
                name="newTask"
                ref={newTaskRef}
                className="rounded-md border border-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full"
                placeholder="New task"
              />
            </div>
            <div className="flex gap-2 mt-2 items-center">
              <Button
                as="button"
                text="Add"
                type="CONFIRM"
                onClick={handleCreateNewTask}
              />
              <Button
                as="button"
                text="Cancel"
                type="CANCEL"
                onClick={() => setShowNewTaskForm(false)}
              />
            </div>
          </div>
        ) : (
          <div
            className="text-gray-700 cursor-pointer mx-4"
            onClick={() => setShowNewTaskForm(true)}>
            + New task...
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanList;
