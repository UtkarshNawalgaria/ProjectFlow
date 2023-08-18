import { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { Task, TaskList } from "../services/tasks";
import { HiPlus } from "react-icons/hi";
import KanbanCard from "./kanban-card";
import NewTaskModal from "./tasks/create-task-modal";
import { BiDotsHorizontalRounded } from "react-icons/bi";

const KanbanList = ({
  tasklist,
  tasks,
}: {
  tasks: Task[];
  tasklist: TaskList;
}) => {
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  return (
    <div className="rounded-md h-full flex flex-col justify-between">
      <Droppable droppableId={tasklist.id.toString()}>
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
                {tasks.map((task, index) => {
                  return <KanbanCard task={task} key={task.id} index={index} />;
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
