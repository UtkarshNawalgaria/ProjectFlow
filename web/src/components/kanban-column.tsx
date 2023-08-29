import { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { HiPlus } from "react-icons/hi";
import KanbanCard from "./kanban-card";
import NewTaskModal from "./modals/tasks/create-task-modal";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { GroupedTasks } from "../context/TasksProvider";

const KanbanList = ({
  tasklist,
  openTask,
}: {
  tasklist: GroupedTasks[0];
  openTask: (taskId: number) => void;
}) => {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const { tasks } = tasklist;

  return (
    <div className="h-full flex flex-col justify-between">
      <Droppable droppableId={"droppable-" + tasklist.id.toString()}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col justify-between h-full">
            <div>
              <header className="mb-4">
                <div className="p-4 font-semibold text-md flex items-center justify-between text-gray-100">
                  <h3>
                    {tasklist.title} ({tasks.length})
                  </h3>
                  <div className="flex">
                    <span className="cursor-pointer p-1 hover:bg-slate-800 rounded-md">
                      <HiPlus
                        onClick={() => setShowNewTaskForm(true)}
                        className="text-base"
                      />
                    </span>
                    <span className="cursor-pointer p-1 hover:bg-slate-800 rounded-md">
                      <BiDotsHorizontalRounded className="text-base" />
                    </span>
                  </div>
                </div>
              </header>
              <div className="px-4">
                {tasks.map((task) => {
                  return (
                    <KanbanCard
                      task={task}
                      key={task.id}
                      index={task.id}
                      openTask={openTask}
                    />
                  );
                })}
              </div>
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <NewTaskModal
        open={showNewTaskForm}
        closeModal={() => setShowNewTaskForm(false)}
      />
    </div>
  );
};

export default KanbanList;
