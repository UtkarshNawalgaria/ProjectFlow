import { Dispatch, SetStateAction, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { BsKanban } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { HiArrowLeft, HiChevronRight, HiPlus, HiTrash } from "react-icons/hi";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Disclosure } from "@headlessui/react";

import PageHeader from "../../components/page-header";
import KanbanList from "../../components/kanban-column";
import NewTaskListModal from "../../components/modals/tasks/create-task-list-modal";
import TaskAside from "../../components/aside/task";
import Editable from "../../components/editable";
import Meta from "../../components/meta";

import useTasks, { TasksProviderType } from "../../context/TasksProvider";
import useUser, { TUserContext } from "../../context/UserProvider";
import { Task } from "../../services/tasks";
import ProjectService from "../../services/projects";
import UserList from "../../components/user-list";

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
    <>
      <span className="inline-block p-2 rounded-full cursor-pointer hover:bg-indigo-300">
        <FiEdit className="text-indigo-500" />
      </span>
      <span className="inline-block p-2 rounded-full cursor-pointer hover:bg-red-300">
        <HiTrash className="text-red-700" onClick={() => deleteTask(taskId)} />
      </span>
    </>
  );
};

const TasksKanbanView = ({
  openTask,
  toggleModal,
}: {
  toggleModal: Dispatch<SetStateAction<boolean>>;
  openTask: (taskId: number) => void;
}) => {
  const { groupedTasks, updateTask, setTasks } =
    useTasks() as TasksProviderType;

  function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    const taskId = parseInt(draggableId);
    const destinationId = parseInt(destination.droppableId.split("-")[1]);

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
    <div className="overflow-x-scroll">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-flow-col auto-cols-[350px] gap-4 h-full">
          {groupedTasks.map((tasksObj) => {
            return (
              <div key={tasksObj.id}>
                <KanbanList tasklist={tasksObj} openTask={openTask} />
              </div>
            );
          })}
          <button
            className="h-[200px] bg-slate-800 border-2 border-dashed border-slate-900 hover:border-slate-800 hover:bg-slate-900 rounded-md transition text-center"
            onClick={() => toggleModal(true)}>
            <HiPlus className="inline-block text-gray-500 text-3xl" />
          </button>
        </div>
      </DragDropContext>
    </div>
  );
};

const TasksListView = ({
  openTask,
}: {
  openTask: (taskId: number) => void;
}) => {
  const { groupedTasks, deleteTask } = useTasks() as TasksProviderType;
  const { user } = useUser() as TUserContext;

  if (groupedTasks.length === 0) {
    return <div>No tasks in this project</div>;
  }

  return (
    <>
      <div className="flex dark:text-grey-lightest ml-4">
        <div className="w-full pl-8 py-2">Task</div>
        <div className="w-full pl-4 py-2">Status</div>
        <div className="w-full pl-4 py-2">Start Date</div>
        <div className="w-full pl-4 py-2">Due Date</div>
        <div className="w-full pl-4 py-2">Actions</div>
      </div>
      {groupedTasks.map((group) => {
        return (
          <div key={group.id} className="relative">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="py-2 my-2 dark:bg-slate-800 dark:text-grey-lightest w-full flex gap-2 items-start pl-2 rounded-md border-l-4">
                    <span className="text-gray-100 p-1 absolute -left-10 mt-4">
                      <BiDotsHorizontalRounded className="h-5 w-5" />
                    </span>
                    <div>
                      <HiChevronRight
                        className={`inline-block h-5 w-5 ${
                          open ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                    <div className="flex flex-col gap-2 items-start">
                      <span className="text-xl font-semibold">
                        {group.title}
                      </span>
                      <span className="text-gray-400">
                        {group.tasks.length} Tasks
                      </span>
                    </div>
                  </Disclosure.Button>
                  <Disclosure.Panel>
                    <div>
                      {group.tasks.map((task) => {
                        return (
                          <div
                            key={task.id}
                            className="bg-gray-50 dark:bg-slate-700 mb-1 rounded-md border-l-4 dark:text-grey-lightest ml-4">
                            <div className="flex items-center">
                              <div
                                className="w-full pl-8 py-2 hover:underline cursor-pointer"
                                onClick={() => openTask(task.id)}>
                                {task.title}
                              </div>
                              <div className="w-full pl-2 py-2">Open</div>
                              <div className="w-full pl-4 py-2">
                                {task.start_date
                                  ? new Date(
                                      task.start_date
                                    ).toLocaleDateString()
                                  : null}
                              </div>
                              <div className="w-full pl-4 py-2">
                                {task.end_date
                                  ? new Date(task.end_date).toLocaleDateString()
                                  : null}
                              </div>
                              <div className="w-full text-left">
                                {user?.id === task.owner ? (
                                  <TaskActions
                                    deleteTask={deleteTask}
                                    taskId={task.id}
                                  />
                                ) : null}
                              </div>
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
                </>
              )}
            </Disclosure>
          </div>
        );
      })}
    </>
  );
};

const SingleProjectPage = () => {
  const {
    project,
    tasks,
    createTaskList,
    updateProject,
    selectCurrentTask,
    selectedTaskId,
  } = useTasks() as TasksProviderType;
  const { user } = useUser() as TUserContext;
  const [view, setView] = useState(TasksViewType.KANBAN);
  const [showTaskListModal, toggleTaskListModal] = useState(false);
  const [showSelectedTask, setShowSelectedTask] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <Meta title={project?.title} />
      <PageHeader>
        <div className="flex gap-4 items-center">
          <Link to="/projects">
            <span className="p-2 font-bold inline-flex text-gray-100 border rounded-md">
              <HiArrowLeft />
            </span>
          </Link>
          <Editable
            text={project?.title}
            allowEditing={project?.owner === user?.id}
            onConfirm={(value) => {
              ProjectService.updateProject(project?.id as number, {
                title: value,
              }).then((project) => updateProject(project));
            }}
            Element={
              <h1 className="font-bold text-lg text-grey-dark dark:text-grey-lightest ml-4">
                {project?.title}
              </h1>
            }
          />
        </div>
        <div className="flex items-center gap-8">
          <UserList userList={project?.assigned_users} />
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
      <section className="px-4">
        {view === TasksViewType.LIST ? (
          <TasksListView
            openTask={(taskId) => {
              selectCurrentTask(taskId);
              setShowSelectedTask(true);
            }}
          />
        ) : (
          <TasksKanbanView
            toggleModal={toggleTaskListModal}
            openTask={(taskId) => {
              selectCurrentTask(taskId);
              setShowSelectedTask(true);
            }}
          />
        )}
      </section>
      <NewTaskListModal
        open={showTaskListModal}
        closeModal={() => toggleTaskListModal(false)}
        onFormSubmit={createTaskList}
      />
      <div className="page-asides">
        {selectedTaskId ? (
          <TaskAside
            open={showSelectedTask}
            close={() => {
              setShowSelectedTask(false);
              selectCurrentTask(0);
            }}
            task={tasks.find((task) => task.id === selectedTaskId)}>
            <div>Hello World</div>
          </TaskAside>
        ) : null}
      </div>
    </div>
  );
};

export default SingleProjectPage;
