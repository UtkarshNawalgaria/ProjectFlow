import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProjectService, { Project } from "../services/projects";
import TaskService, {
  DefaultTaskList,
  Task,
  TaskCreate,
  TaskList,
  TaskListCreate,
} from "../services/tasks";
import { TError } from "../services/client";

export type GroupedTasks = Array<
  {
    tasks: Task[];
  } & TaskList
>;

export type TasksProviderType = {
  project: Project | null;
  tasks: Task[];
  lists: TaskList[];
  groupedTasks: GroupedTasks;
  selectedTaskId: number;
  addNewTask: (task: TaskCreate) => void;
  createTaskList: (list: TaskListCreate) => void;
  deleteTask: (id: number) => void;
  updateTask: (
    taskId: number,
    data: Record<string, string | number | null>
  ) => void;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  selectCurrentTask: (taskId: number) => void;
  updateProject: (project: Project) => void;
};

type Props = {
  children: JSX.Element;
};

const TasksContext = createContext<TasksProviderType | null>(null);

export const TasksProvider = ({ children }: Props) => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number>(0);

  // Fetch project details, tasks and tasklists related to the project
  useEffect(() => {
    ProjectService.getById(parseInt(projectId as string)).then((response) => {
      setTasks(response.tasks);
      setLists(response.tasklists);
      setProject(response);
    });
  }, []);

  const groupedTasks = useMemo<GroupedTasks>(() => {
    const outputData: GroupedTasks = [];

    if (lists.length == 0) return [{ ...DefaultTaskList, tasks: tasks }];

    outputData.push({
      ...DefaultTaskList,
      tasks: tasks.filter((task) => task.tasklist === null),
    });

    lists.forEach((list) => {
      const listTasks = tasks.filter((task) => task.tasklist === list.id);
      outputData.push({ ...list, tasks: listTasks });
    });

    return outputData;
  }, [tasks, lists]);

  const addNewTask = (task: TaskCreate) => {
    TaskService.createTask(task)
      .then((task) => {
        setTasks((prevTasks) => [...prevTasks, task]);
        toast.success("Task Created Successfully.");
      })
      .catch(() => toast.error("Error creating task"));
  };

  const updateTask = (
    taskId: number,
    data: Record<keyof Task, string | number | null>
  ) => {
    TaskService.updateTask(taskId, data)
      .then((updatedTask) => {
        setTasks((prevTasks) => {
          return [
            ...prevTasks.filter((task) => task.id !== taskId),
            updatedTask,
          ];
        });
        toast.success("Task Updated successfully");
      })
      .catch((error: TError) => {
        if (typeof error === "object") {
          if ("detail" in error) {
            toast.error(error.detail);
          }
        }
      });
  };

  const deleteTask = (taskId: number) => {
    TaskService.delete(taskId).then(() => {
      setTasks((prevData) => prevData.filter((task) => task.id !== taskId));
      toast.success("Task Deleted successfully");
    });
  };

  const createTaskList = (list: TaskListCreate) => {
    TaskService.createTaskList(list).then((list) => {
      setLists((lists) => [...lists, list]);
      toast.success("Task List Created Successfully");
    });
  };

  const selectCurrentTask = (taskId: number) => {
    setSelectedTaskId(taskId);
  };

  const updateProject = (project: Project) => {
    setProject(project);
  };

  return (
    <TasksContext.Provider
      value={{
        project,
        tasks,
        lists,
        groupedTasks,
        addNewTask,
        updateTask,
        deleteTask,
        createTaskList,
        setTasks,
        selectedTaskId,
        selectCurrentTask,
        updateProject,
      }}>
      {children}
    </TasksContext.Provider>
  );
};

const useTasks = () => useContext(TasksContext);

export default useTasks;
