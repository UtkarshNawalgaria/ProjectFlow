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
  tasklist_id?: number;
  start_date?: string;
  due_date?: string;
};

export type TaskList = {
  id: number;
  title: string;
  project_id: number;
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
    return client<Task>(`task/${taskId}`);
  },
  createTask: (task: TaskCreate) => {
    return client<Task>("task/", {
      method: "POST",
      body: JSON.stringify(task),
    });
  },
  delete: (taskId: number) => {
    return client(`task/${taskId}`, {
      method: "DELETE",
    });
  },
  getAllTaskLists: (projectId: number) => {
    return client<TaskList[]>(`task/get_list?project_id=${projectId}`);
  },
};
