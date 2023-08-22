import { Dispatch, SetStateAction, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { BsKanban } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { HiArrowLeft, HiChevronDown, HiPlus, HiTrash } from "react-icons/hi";
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
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 h-full overflow-x-scroll">
          {groupedTasks.map((tasksObj) => {
            return (
              <div key={tasksObj.id} className="w-[300px]">
                <KanbanList tasklist={tasksObj} openTask={openTask} />
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
      <div className="flex dark:text-grey-lightest">
        <div className="w-full pl-8 py-2">Task</div>
        <div className="w-full pl-4 py-2">Status</div>
        <div className="w-full pl-4 py-2">Start Date</div>
        <div className="w-full pl-4 py-2">Due Date</div>
        <div className="w-full pl-4 py-2">Actions</div>
      </div>
      {groupedTasks.map((group) => {
        return (
          <div key={group.id}>
            <Disclosure>
              <Disclosure.Button className="py-2 my-2 dark:bg-slate-800 dark:text-grey-lightest w-full flex items-center justify-between pr-4 pl-8 rounded-sm">
                <span>{group.title}</span>
                <span>
                  <HiChevronDown className="inline-block" />
                </span>
              </Disclosure.Button>
              <Disclosure.Panel>
                <div>
                  {group.tasks.map((task) => {
                    return (
                      <div
                        key={task.id}
                        className="bg-gray-50 dark:bg-slate-700 mb-1 rounded-md dark:text-grey-lightest">
                        <div className="flex items-center">
                          <div
                            className="w-full pl-8 py-2 hover:underline cursor-pointer"
                            onClick={() => openTask(task.id)}>
                            {task.title}
                          </div>
                          <div className="w-full pl-2 py-2">Open</div>
                          <div className="w-full pl-4 py-2">
                            {task?.start_date}
                          </div>
                          <div className="w-full pl-4 py-2">
                            {task.due_date}
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
            </Disclosure>
          </div>
        );
      })}
    </>
  );
};

const SingleProjectPage = () => {
  const { project, tasks, createTaskList, updateProject } =
    useTasks() as TasksProviderType;
  const { user } = useUser() as TUserContext;
  const [view, setView] = useState(TasksViewType.KANBAN);
  const [showTaskListModal, toggleTaskListModal] = useState(false);
  const [showSelectedProject, setShowSelectedProject] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number>(0);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? null;

  return (
    <div className="flex flex-col h-full overflow-x-scroll">
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
          <TasksListView
            openTask={(taskId) => {
              setShowSelectedProject(true);
              setSelectedTaskId(taskId);
            }}
          />
        ) : (
          <TasksKanbanView
            toggleModal={toggleTaskListModal}
            openTask={(taskId) => {
              setShowSelectedProject(true);
              setSelectedTaskId(taskId);
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
        {selectedTask ? (
          <TaskAside
            open={showSelectedProject}
            close={() => {
              setShowSelectedProject(false);
              setSelectedTaskId(0);
            }}
            task={selectedTask}>
            <div>Hello World</div>
          </TaskAside>
        ) : null}
      </div>
    </div>
  );
};

export default SingleProjectPage;
