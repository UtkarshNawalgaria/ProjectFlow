import useClient from "./client";
import { Task, TaskList } from "./tasks";

export type ProjectData = {
  title: string;
  description?: string;
  organization: number;
  owner: number;
};

export type ProjectWithTasks = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  task_count: number;
  tasks: Task[];
  tasklists: TaskList[];
};

export type Project = Omit<ProjectWithTasks, "tasks" | "tasklists"> & {
  image_url?: string;
};

export default {
  getAll: (organizatioId: number | undefined) => {
    if (!organizatioId) return Promise.reject("No Organization Id");
    return useClient<Project[]>(`project/?organization_id=${organizatioId}`);
  },
  getById: (projectId: number) => {
    return useClient<ProjectWithTasks>(`project/${projectId}/`);
  },
  createProject: (project: ProjectData) => {
    return useClient<Project>("project/", {
      method: "POST",
      body: JSON.stringify(project),
    });
  },
  delete: (projectId: number) => {
    return useClient(`project/${projectId}/`, {
      method: "DELETE",
    });
  },
};
