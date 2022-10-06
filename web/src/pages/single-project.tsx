import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { BsKanban } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { HiArrowLeft, HiChevronDown, HiPlus, HiTrash } from "react-icons/hi";

import { DndContext, DragEndEvent } from "@dnd-kit/core";

import Collapsable, {
  CollapsableBody,
  CollapsableHead,
} from "../components/collapsable";
import PageHeader from "../components/page-header";

import ProjectService, { Project } from "../services/projects";
import TaskService, {
  DefaultTaskList,
  emptyTask,
  Task,
  TaskCreate,
  TaskList,
} from "../services/tasks";
import KanbanCard from "../components/kanban-card";
import KanbanList from "../components/kanban-column";
import { toast } from "react-toastify";
import Modal from "../components/modal";
import { ProcessedFormErrorType } from "../utils";
import Button from "../components/button";

type GroupedTasks = Array<{
  list: TaskList;
  tasks: Task[];
}>;

type TaskViewProps = {
  groupedTasks: GroupedTasks;
  setTasks: any;
  deleteTask: (taskId: number) => void;
  updateTask: (taskId: number, data: any) => void;
};

const TasksViewType = {
  LIST: 0,
  KANBAN: 1,
};

const TaskActions = () => {
  return (
    <div className="w-full text-left">
      <span className="inline-block p-2 rounded-full cursor-pointer hover:bg-indigo-300">
        <FiEdit className="text-indigo-700" />
      </span>
      <span className="inline-block p-2 rounded-full cursor-pointer hover:bg-red-300">
        <HiTrash className="text-red-700" />
      </span>
    </div>
  );
};

const TasksKanbanView = ({
  groupedTasks,
  setTasks,
  updateTask,
}: TaskViewProps) => {
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const taskId = active.id;
    const newTaskListId = over?.id as number;

    if (newTaskListId == null) return;

    const prevList = active?.data?.current?.list;
    const currList = over?.data?.current?.tasklist;

    // Change the moved task's `tasklist_id` value in the frontend
    // before updating on the backend to avoid lag in changing the
    // tasks list in kanban mode
    setTasks((prevTasks: Task[]) => {
      const currTask = prevTasks.find((task) => task.id === taskId);
      const remainingTasks = prevTasks.filter((task) => task.id !== taskId);

      if (currTask) {
        currTask.tasklist_id = newTaskListId != 0 ? newTaskListId : null;
        remainingTasks.push(currTask);
      }

      return remainingTasks;
    });

    updateTask(taskId as number, {
      tasklist_id: newTaskListId === 0 ? null : newTaskListId,
    });

    if (prevList.id !== currList.id) {
      toast.success(`Task moved from ${prevList.title} to ${currList.title}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  return (
    <div>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4">
          {groupedTasks.map((item) => {
            return (
              <div key={item.list.id} className="w-[300px]">
                <KanbanList tasklist={item.list}>
                  <header className="mb-4">
                    <div className="p-4 font-semibold text-lg flex items-center justify-between text-gray-700">
                      <h3>{item.list.title}</h3>
                    </div>
                  </header>
                  <div className="px-4">
                    {item.tasks.map((task) => {
                      return (
                        <div key={task.id}>
                          <KanbanCard task={task} list={item.list}>
                            <div>{task.title}</div>
                          </KanbanCard>
                        </div>
                      );
                    })}
                  </div>
                </KanbanList>
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
};

const TasksListView = ({ groupedTasks }: TaskViewProps) => {
  if (groupedTasks.length === 0) {
    return <div>No tasks in this project</div>;
  }

  return (
    <>
      <div className="flex">
        <div className="w-full pl-8 py-2">Task</div>
        <div className="w-full pl-4 py-2">Status</div>
        <div className="w-full pl-4 py-2">Start Date</div>
        <div className="w-full pl-4 py-2">Due Date</div>
        <div className="w-full pl-4 py-2">Actions</div>
      </div>
      {groupedTasks.map((item) => {
        return (
          <div key={item.list.id}>
            <Collapsable>
              <CollapsableHead styles="py-2 px-3 border flex w-full cursor-pointer font-bold">
                <div>
                  <HiChevronDown className="inline-block" />
                  <span className="pl-4">{item.list.title}</span>
                </div>
              </CollapsableHead>
              <CollapsableBody>
                <div className="px-4">
                  {item.tasks.map((task, index) => {
                    return (
                      <div
                        key={task.id}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50 " : "bg-gray-200"
                        }`}>
                        <div className="flex items-center">
                          <div className="w-full pl-8 py-2">{task.title}</div>
                          <div className="w-full pl-4 py-2">
                            {task.status === 0 ? "Open" : "Completed"}
                          </div>
                          <div className="w-full pl-4 py-2">
                            {task?.start_date}
                          </div>
                          <div className="w-full pl-4 py-2">
                            {task.due_date}
                          </div>
                          <TaskActions />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CollapsableBody>
            </Collapsable>
          </div>
        );
      })}
    </>
  );
};

const SingleProjectPage = () => {
  const { projectId } = useParams();
  const [view, setView] = useState(TasksViewType.KANBAN);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [createTask, setCreateTask] = useState(false);
  const [newTask, setNewTask] = useState<TaskCreate>({
    ...emptyTask,
    project_id: parseInt(projectId as string),
  });
  const [error, setError] = useState<ProcessedFormErrorType | null>(null);

  useEffect(() => {
    Promise.all([
      ProjectService.getById(parseInt(projectId as string)),
      TaskService.getAll(parseInt(projectId as string)),
      TaskService.getAllTaskLists(parseInt(projectId as string)),
    ])
      .then((values) => {
        setProject(values[0]);
        setTasks(values[1]);
        setLists(values[2]);
      })
      .catch((error) => setError(error));
  }, []);

  const groupedTasks = useMemo<GroupedTasks>(() => {
    const outputData: GroupedTasks = [];

    if (lists.length == 0) return [];

    outputData.push({
      list: DefaultTaskList,
      tasks: tasks.filter((task) => task.tasklist_id === null),
    });

    lists.forEach((list) => {
      const listTasks = tasks.filter((task) => task.tasklist_id === list.id);
      outputData.push({ list, tasks: listTasks });
    });

    return outputData;
  }, [tasks, lists]);

  const deleteTask = (taskId: number) => {
    TaskService.delete(taskId).then(() => {
      setTasks((prevData) => prevData.filter((task) => task.id !== taskId));
    });
  };

  const updateTask = (
    taskId: number,
    data: { [key: string]: string | number }
  ) => {
    TaskService.updateTask(taskId, data).then((updatedTask) => {
      setTasks((prevTasks) => {
        return [...prevTasks.filter((task) => task.id !== taskId), updatedTask];
      });
    });
  };

  const setNewTaskFormData = (
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | ChangeEvent<HTMLSelectElement>
  ) => {
    setNewTask((prevData) => {
      return { ...prevData, [event.target.name]: event.target.value };
    });
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    TaskService.createTask(newTask)
      .then((newTask) => {
        setTasks((allTasks) => [...allTasks, newTask]);
        setNewTask({
          ...emptyTask,
          project_id: parseInt(projectId as string),
        });
        setCreateTask(false);
        toast.success("New Task Created", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((e) => {
        setError(e);
        toast.error("Error creating Task", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };

  return (
    <div className="flex flex-col">
      <PageHeader>
        <div className="flex gap-4">
          <Link to="/projects">
            <span className="p-3 font-bold inline-flex text-grey-dark ring-1 ring-slate-900/10 rounded-lg hover:text-primary hover:bg-grey-lightest hover:ring-primary">
              <HiArrowLeft />
            </span>
          </Link>
          <h1 className="font-bold text-3xl text-grey-dark ml-4">
            {project?.title}
          </h1>
        </div>
        <div className="toolbar flex items-center gap-8">
          <div>
            <Button
              text="Add Task"
              type="CONFIRM"
              onClick={() => setCreateTask(true)}
              icon={<HiPlus className="font-semibold text-lg" />}
            />
          </div>
          <div className="rounded-md shadow-md shadow-gray-200 bg-gray-100 flex">
            <span
              className={
                "p-1 block cursor-pointer m-1" +
                (view === TasksViewType.LIST
                  ? " bg-white rounded-md text-grey-dark"
                  : "")
              }
              onClick={() => setView(TasksViewType.LIST)}>
              <AiOutlineUnorderedList className="h-6 w-6 text-black" />
            </span>
            <span
              className={
                "p-1 block cursor-pointer m-1" +
                (view === TasksViewType.KANBAN
                  ? " bg-white rounded-md text-grey-dark"
                  : "")
              }
              onClick={() => setView(TasksViewType.KANBAN)}>
              <BsKanban className="h-6 w-6 text-black" />
            </span>
          </div>
        </div>
      </PageHeader>
      <section className="px-4">
        {view === TasksViewType.LIST ? (
          <TasksListView
            deleteTask={deleteTask}
            groupedTasks={groupedTasks}
            setTasks={setTasks}
            updateTask={updateTask}
          />
        ) : (
          <TasksKanbanView
            deleteTask={deleteTask}
            groupedTasks={groupedTasks}
            setTasks={setTasks}
            updateTask={updateTask}
          />
        )}
      </section>
      <div>
        <Modal
          modalId="create-new-task"
          headerText="Add new task"
          toggleModal={createTask}
          body={
            <form className="w-full" onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-md font-medium text-grey-dark mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newTask?.title}
                  onChange={(e) => setNewTaskFormData(e)}
                  className={
                    "rounded-md border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full" +
                    (error !== null && error.title
                      ? " border-error"
                      : " border-gray-300")
                  }
                />
                {error !== null && error.title ? (
                  <span className="text-sm text-error">{error.title}</span>
                ) : null}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-md font-medium text-grey-dark mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={newTask.description}
                  onChange={(e) => setNewTaskFormData(e)}
                  className={
                    "rounded-md border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full" +
                    (error !== null && error.description
                      ? " border-error"
                      : " border-gray-300")
                  }
                />
                {error !== null && error.description ? (
                  <span className="text-sm text-error">
                    {error.description}
                  </span>
                ) : null}
              </div>
              <div className="mb-4">
                <label className="block text-md font-medium text-grey-dark mb-1">
                  Choose List
                </label>
                <select
                  onChange={(e) => setNewTaskFormData(e)}
                  className="rounded-md border focus: border-primary focus:ring-1 focus:ring-primary w-1/2"
                  name="tasklist_id"
                  defaultValue={undefined}>
                  <option value="0">Todo</option>
                  {lists.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 mt-10">
                <button
                  className="w-1/2 outline outline-1 rounded-md font-semibold text-primary cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setError(null);
                    setNewTask({
                      ...emptyTask,
                      project_id: parseInt(projectId as string),
                    });
                    setCreateTask(false);
                  }}>
                  Cancel
                </button>
                <button className="text-center bg-primary py-3 rounded-md font-semibold text-white cursor-pointer w-1/2">
                  Create Project
                </button>
              </div>
            </form>
          }
        />
      </div>
    </div>
  );
};

export default SingleProjectPage;
