import useClient from "./client";

export type Task = {
  id: number;
  url: string;
  title: string;
  owner: number;
  project: number;
  description: string | null;
  tasklist: number | null;
  start_date: string | null;
  due_date: string | null;
};

export type TaskCreate = {
  title: string;
  project: number;
  owner: number | null;
  description?: string;
  tasklist: number | null;
  start_date?: string | null;
  due_date?: string | null;
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
  due_date: null,
  owner: null,
};

export const DefaultTaskList = {
  id: 0,
  title: "Todo",
  project: 0,
};

export default {
  getAll: (projectId: number) => {
    return useClient<Task[]>(`task/?project_id=${projectId}`);
  },
  getById: (taskId: number) => {
    return useClient<Task>(`task/${taskId}/`);
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
    return useClient(`task/${taskId}/`, {
      method: "DELETE",
    });
  },
  getAllTaskLists: (projectId: number) => {
    return useClient<TaskList[]>(`tasklist/?project_id=${projectId}`);
  },
  createTaskList: (title: string, projectId: number) => {
    return useClient<TaskList>(`tasklist/?project_id=${projectId}`, {
      method: "POST",
      body: JSON.stringify({ title: title }),
    });
  },
};
