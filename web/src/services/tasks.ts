import client from "./client";

enum TaskStatus {
  OPEN = 0,
  COMPLETE = 1,
}

export type Task = {
  id: number;
  title: string;
  status: TaskStatus;
  description?: string;
  project_id?: number;
  tasklist_id: number | null;
  start_date?: string;
  due_date?: string;
};

export type TaskCreate = {
  title: string;
  project_id: number;
  description?: string;
  tasklist_id?: number | null;
  start_date?: string | null;
  due_date?: string | null;
};

export type TaskListCreate = {
  title: string;
  project_id: number;
};

export type TaskList = {
  id: number;
} & TaskListCreate;

export const emptyTask: TaskCreate = {
  title: "",
  project_id: 0,
  description: "",
  tasklist_id: null,
  start_date: null,
  due_date: null,
};

export const DefaultTaskList = {
  id: 0,
  title: "Todo",
  project_id: 0,
};

export default {
  getAll: (projectId: number) => {
    return client<Task[]>(`task/?project_id=${projectId}`);
  },
  getById: (taskId: number) => {
    return client<Task>(`task/${taskId}/`);
  },
  createTask: (task: TaskCreate) => {
    return client<Task>("task/", {
      method: "POST",
      body: JSON.stringify(task),
    });
  },
  updateTask: (
    taskId: number,
    update_data: { [key: string]: string | number | null }
  ) => {
    return client<Task>(`task/${taskId}/`, {
      method: "PATCH",
      body: JSON.stringify(update_data),
    });
  },
  delete: (taskId: number) => {
    return client(`task/${taskId}/`, {
      method: "DELETE",
    });
  },
  getAllTaskLists: (projectId: number) => {
    return client<TaskList[]>(`task/get_list?project_id=${projectId}`);
  },
  createTaskList: (data: TaskListCreate) => {
    return client<TaskList>("task/create_list/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
