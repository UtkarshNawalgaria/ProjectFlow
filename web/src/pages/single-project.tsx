import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { BsKanban } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { HiArrowLeft, HiChevronDown, HiPlus, HiTrash } from "react-icons/hi";
import { toast } from "react-toastify";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

import Collapsable, {
  CollapsableBody,
  CollapsableHead,
} from "../components/collapsable";
import PageHeader from "../components/page-header";
import Button from "../components/button";
import KanbanCard from "../components/kanban-card";
import KanbanList from "../components/kanban-column";
import NewTaskListModal from "../components/tasks/create-task-list-modal";
import NewTaskModal from "../components/tasks/create-task-modal";

import ProjectService, { Project } from "../services/projects";
import TaskService, {
  DefaultTaskList,
  Task,
  TaskCreate,
  TaskList,
  TaskListCreate,
} from "../services/tasks";
import { ProcessedFormErrorType } from "../utils";

type GroupedTasks = Array<{
  list: TaskList;
  tasks: Task[];
}>;

type TaskViewProps = {
  groupedTasks: GroupedTasks;
  setTasks: any;
  deleteTask: (taskId: number) => void;
  updateTask: (
    taskId: number,
    data: { [key: string]: string | number | null }
  ) => void;
  addNewTask: (task: TaskCreate) => void;
  toggleModal: any;
};

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
  groupedTasks,
  setTasks,
  updateTask,
  toggleModal,
  addNewTask,
}: TaskViewProps) => {
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const taskId = active.id;
    const newTaskListId = over?.id as number;

    if (newTaskListId == null) return;

    const prevList = active?.data?.current?.list;
    const currList = over?.data?.current?.tasklist;

    if (prevList.id !== currList.id) {
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
                <KanbanList tasklist={item.list} addNewTask={addNewTask}>
                  <header className="mb-4">
                    <div className="p-4 font-semibold text-lg flex items-center justify-between text-gray-700">
                      <h3>
                        {item.list.title} ({item.tasks.length})
                      </h3>
                    </div>
                  </header>
                  <div className="px-4">
                    {item.tasks.map((task) => {
                      return (
                        <KanbanCard
                          task={task}
                          list={item.list}
                          key={task.id}
                        />
                      );
                    })}
                  </div>
                </KanbanList>
              </div>
            );
          })}
          <button
            className="w-[300px] h-[200px] bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-100 rounded-md mt-10 transition text-center"
            onClick={() => toggleModal(true)}>
            <HiPlus className="inline-block text-gray-500 text-3xl" />
          </button>
        </div>
      </DndContext>
    </div>
  );
};

const TasksListView = ({ groupedTasks, deleteTask }: TaskViewProps) => {
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
              <CollapsableHead styles="py-2 px-3 border-x border-t flex w-full cursor-pointer font-bold">
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
                          <div className="w-full pl-2 py-2">
                            {task.status === 0 ? "Open" : "Completed"}
                          </div>
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
  const [, setError] = useState<ProcessedFormErrorType | null>(null);

  // Data from API
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);

  const [showCreateTask, toggleCreateTaskModal] = useState(false);
  const [showTaskListModal, toggleTaskListModal] = useState(false);

  // Fetch project details, tasks and tasklists related to the project
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

    if (lists.length == 0) return [{ list: DefaultTaskList, tasks: tasks }];

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
      toast.success("Task Deleted successfully");
    });
  };

  const updateTask = (
    taskId: number,
    data: { [key: string]: string | number | null }
  ) => {
    TaskService.updateTask(taskId, data).then((updatedTask) => {
      setTasks((prevTasks) => {
        return [...prevTasks.filter((task) => task.id !== taskId), updatedTask];
      });
      toast.success("Task Updated successfully");
    });
  };

  const createTaskList = (list: TaskListCreate) => {
    TaskService.createTaskList(list).then((list) => {
      setLists((lists) => [...lists, list]);
      toast.success("Task List Created Successfully");
    });
  };

  const addNewTask = (task: TaskCreate) => {
    TaskService.createTask(task)
      .then((task) => {
        setTasks((prevTasks) => [...prevTasks, task]);
        toast.success("Task Created Successfully.");
      })
      .catch(() => toast.error("Error creating task"));
  };

  const props = {
    addNewTask,
    deleteTask,
    groupedTasks,
    setTasks,
    updateTask,
    toggleModal: toggleTaskListModal,
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
        <div className="flex items-center gap-8" id="toolbar">
          <div>
            <Button
              text="Add Task"
              type="CONFIRM"
              onClick={() => toggleCreateTaskModal(true)}
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
          <TasksListView {...props} />
        ) : (
          <TasksKanbanView {...props} />
        )}
      </section>
      <NewTaskListModal
        open={showTaskListModal}
        closeModal={() => toggleTaskListModal(false)}
        onFormSubmit={createTaskList}
      />
      <NewTaskModal
        open={showCreateTask}
        closeModal={() => toggleCreateTaskModal(false)}
        lists={lists}
        addNewTask={addNewTask}
      />
    </div>
  );
};

export default SingleProjectPage;
