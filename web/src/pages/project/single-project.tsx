import { Dispatch, SetStateAction, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { BsKanban } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { HiArrowLeft, HiChevronDown, HiPlus, HiTrash } from "react-icons/hi";

import PageHeader from "../../components/page-header";
import KanbanList from "../../components/kanban-column";
import NewTaskListModal from "../../components/tasks/create-task-list-modal";

import useTasks, { TasksProviderType } from "../../context/TasksProvider";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Task } from "../../services/tasks";
import { Disclosure } from "@headlessui/react";

const TasksViewType = {
  LIST: 0,
  KANBAN: 1,
};

const TaskActions = ({
  taskId,
  deleteTask,
}: {
  taskId: number;
  deleteTask: (taskId: number) => void;
}) => {
  return (
    <div className="w-full text-left">
      <span className="inline-block p-2 rounded-full cursor-pointer hover:bg-indigo-300">
        <FiEdit className="text-indigo-700" />
      </span>
      <span className="inline-block p-2 rounded-full cursor-pointer hover:bg-red-300">
        <HiTrash className="text-red-700" onClick={() => deleteTask(taskId)} />
      </span>
    </div>
  );
};

const TasksKanbanView = ({
  toggleModal,
}: {
  toggleModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { groupedTasks, updateTask, setTasks } =
    useTasks() as TasksProviderType;

  function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    const taskId = parseInt(draggableId);
    const destinationId = parseInt(destination.droppableId as string);

    // Change the moved task's `tasklist_id` value in the frontend
    // before updating on the backend to avoid lag in changing the
    // tasks list in kanban mode
    setTasks((prevTasks: Task[]) => {
      const currTask = prevTasks.find((task) => task.id === taskId);
      const remainingTasks = prevTasks.filter((task) => task.id !== taskId);
      if (currTask) {
        currTask.tasklist = destinationId != 0 ? destinationId : null;
        remainingTasks.push(currTask);
      }
      return remainingTasks;
    });

    updateTask(taskId as number, {
      tasklist: destinationId === 0 ? null : destinationId,
    });
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 h-full">
          {groupedTasks.map((tasksObj) => {
            return (
              <div key={tasksObj.list.id} className="w-[300px]">
                <KanbanList tasklist={tasksObj.list} tasks={tasksObj.tasks} />
              </div>
            );
          })}
          <button
            className="w-[300px] h-[200px] bg-slate-800 border-2 border-dashed border-slate-900 hover:border-slate-800 hover:bg-slate-900 rounded-md transition text-center"
            onClick={() => toggleModal(true)}>
            <HiPlus className="inline-block text-gray-500 text-3xl" />
          </button>
        </div>
      </DragDropContext>
    </>
  );
};

const TasksListView = () => {
  const { groupedTasks, deleteTask } = useTasks() as TasksProviderType;

  if (groupedTasks.length === 0) {
    return <div>No tasks in this project</div>;
  }

  return (
    <>
      <div className="flex dark:text-grey-lightest">
        <div className="w-full pl-8 py-2">Task</div>
        <div className="w-full pl-4 py-2">Status</div>
        <div className="w-full pl-4 py-2">Start Date</div>
        <div className="w-full pl-4 py-2">Due Date</div>
        <div className="w-full pl-4 py-2">Actions</div>
      </div>
      {groupedTasks.map((group) => {
        return (
          <div key={group.list.id}>
            <Disclosure>
              <Disclosure.Button className="py-2 my-2 dark:bg-slate-800 dark:text-grey-lightest w-full flex items-center justify-between px-4 rounded-sm">
                <span>{group.list.title}</span>
                <span>
                  <HiChevronDown className="inline-block" />
                </span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div className="">
                  {group.tasks.map((task) => {
                    return (
                      <div
                        key={task.id}
                        className="bg-gray-50 dark:bg-slate-700 mb-1 rounded-md dark:text-grey-lightest">
                        <div className="flex items-center">
                          <div className="w-full pl-8 py-2">{task.title}</div>
                          <div className="w-full pl-2 py-2">Open</div>
                          <div className="w-full pl-4 py-2">
                            {task?.start_date}
                          </div>
                          <div className="w-full pl-4 py-2">
                            {task.due_date}
                          </div>
                          <TaskActions
                            deleteTask={deleteTask}
                            taskId={task.id}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {group.tasks.length === 0 ? (
                    <div className="text-center py-2 bg-gray-50 dark:bg-slate-700">
                      No Tasks
                    </div>
                  ) : null}
                </div>
              </Disclosure.Panel>
            </Disclosure>
            {/* <Collapsable>
              <CollapsableHead styles="py-2 px-3 border-x border-t flex w-full cursor-pointer font-bold">
                <div>
                  <HiChevronDown className="inline-block" />
                  <span className="pl-4">{group.list.title}</span>
                </div>
              </CollapsableHead>
              <CollapsableBody>
                <div className="px-4">
                  {group.tasks.map((task, index) => {
                    return (
                      <div
                        key={task.id}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50 " : "bg-gray-200"
                        }`}>
                        <div className="flex items-center">
                          <div className="w-full pl-8 py-2">{task.title}</div>
                          <div className="w-full pl-2 py-2">Open</div>
                          <div className="w-full pl-4 py-2">
                            {task?.start_date}
                          </div>
                          <div className="w-full pl-4 py-2">
                            {task.due_date}
                          </div>
                          <TaskActions
                            deleteTask={deleteTask}
                            taskId={task.id}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {group.tasks.length === 0 ? (
                    <div className="text-center py-2 bg-gray-50">No Tasks</div>
                  ) : null}
                </div>
              </CollapsableBody>
            </Collapsable> */}
          </div>
        );
      })}
    </>
  );
};

const SingleProjectPage = () => {
  const { project, createTaskList } = useTasks() as TasksProviderType;
  const [view, setView] = useState(TasksViewType.KANBAN);
  const [showTaskListModal, toggleTaskListModal] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <PageHeader>
        <div className="flex gap-4 items-center">
          <Link to="/projects">
            <span className="p-2 font-bold inline-flex text-gray-100 border rounded-md">
              <HiArrowLeft />
            </span>
          </Link>
          <h1 className="font-bold text-lg text-grey-dark dark:text-grey-lightest ml-4">
            {project?.title}
          </h1>
        </div>
        <div className="flex items-center gap-8" id="toolbar">
          <div className="rounded-md shadow-md shadow-gray-200 dark:shadow-none bg-gray-100 dark:bg-slate-900 dark:border dark:border-slate-700 flex">
            <span
              className={
                "p-1 block cursor-pointer m-1" +
                (view === TasksViewType.KANBAN
                  ? " bg-white dark:bg-slate-800 rounded-md text-grey-dark"
                  : "")
              }
              onClick={() => setView(TasksViewType.KANBAN)}>
              <BsKanban className="h-6 w-6 text-black dark:text-grey-lightest" />
            </span>
            <span
              className={
                "p-1 block cursor-pointer m-1" +
                (view === TasksViewType.LIST
                  ? " bg-white dark:bg-slate-800 rounded-md text-grey-dark"
                  : "")
              }
              onClick={() => setView(TasksViewType.LIST)}>
              <AiOutlineUnorderedList className="h-6 w-6 text-black dark:text-grey-lightest" />
            </span>
          </div>
        </div>
      </PageHeader>
      <section className="px-4 h-full">
        {view === TasksViewType.LIST ? (
          <TasksListView />
        ) : (
          <TasksKanbanView toggleModal={toggleTaskListModal} />
        )}
      </section>
      <NewTaskListModal
        open={showTaskListModal}
        closeModal={() => toggleTaskListModal(false)}
        onFormSubmit={createTaskList}
      />
    </div>
  );
};

export default SingleProjectPage;
