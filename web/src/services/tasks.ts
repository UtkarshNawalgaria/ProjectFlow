import client from "./client";

export type Task = {
  id: number;
  title: string;
  description: string;
  project_id: number | null;
  tasklist_id: number | null;
  start_date: string | null;
};

export default {
  getAll: (projectId: number) => {
    return client<Task[]>(`task/?project_id=${projectId}`);
  },
};
