import useClient from "./client";
import { Task, TaskList } from "./tasks";
import { AssociatedUsersList } from "./users";

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
  owner: number;
  description: string | null;
  task_count: number;
  tasks: Task[];
  tasklists: TaskList[];
  assigned_users: AssociatedUsersList;
};

export type Project = Omit<ProjectWithTasks, "tasks" | "tasklists"> & {
  image_url?: string;
};

const ProjectService = {
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
  updateProject: (
    projectId: number,
    update_data: Record<string, string | number | null>
  ) => {
    return useClient<Project>(`project/${projectId}/`, {
      method: "PATCH",
      body: JSON.stringify(update_data),
    });
  },
  delete: (projectId: number) => {
    return useClient<null>(`project/${projectId}/`, {
      method: "DELETE",
    });
  },
};

export default ProjectService;
