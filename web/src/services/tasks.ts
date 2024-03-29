import useClient from "./client";

export const priorityOptions = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export type TaskPriority = keyof typeof priorityOptions;

export type Task = {
  id: number;
  url: string;
  title: string;
  owner: number;
  project: number;
  priority: TaskPriority;
  description: string | null;
  tasklist: number | null;
  start_date: string | null;
  end_date: string | null;
  parent: number | null;
};

export type TaskCreate = {
  title: string;
  project: number;
  owner: number | null;
  priority: TaskPriority;
  description?: string;
  tasklist: number | null;
  start_date?: string | null;
  end_date?: string | null;
  parent: number | null;
};

export type TaskListCreate = {
  title: string;
  project: number;
};

export type TaskList = {
  id: number;
  title: string;
};

export const emptyTask: TaskCreate = {
  title: "",
  project: 0,
  description: "",
  tasklist: null,
  start_date: null,
  end_date: null,
  owner: null,
  priority: "low",
  parent: null,
};

export const DefaultTaskList = {
  id: 99999,
  title: "Backlog",
};

const TaskService = {
  getAll: (projectId: number) => {
    return useClient<Task[]>(`task/?project_id=${projectId}`);
  },
  getById: (taskId: number, getSubtasks = false) => {
    return useClient<Task>(`task/${taskId}/?get_all=${getSubtasks}`);
  },
  getSubTasks: (taskId: number) => {
    return useClient<Task[]>(`task/${taskId}/subtasks/`);
  },
  createTask: (task: TaskCreate) => {
    return useClient<Task>("task/", {
      method: "POST",
      body: JSON.stringify(task),
    });
  },
  updateTask: (
    taskId: number,
    update_data: Record<string, string | number | null>
  ) => {
    return useClient<Task>(`task/${taskId}/`, {
      method: "PATCH",
      body: JSON.stringify(update_data),
    });
  },
  delete: (taskId: number) => {
    return useClient<null>(`task/${taskId}/`, {
      method: "DELETE",
    });
  },
  getAllTaskLists: (projectId: number) => {
    return useClient<TaskList[]>(`tasklist/?project_id=${projectId}`);
  },
  createTaskList: (listCreate: TaskListCreate) => {
    return useClient<TaskList>(`tasklist/`, {
      method: "POST",
      body: JSON.stringify({ ...listCreate }),
    });
  },
};

export default TaskService;
