import client from "./client";

export type Project = {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
  owner_id?: number;
};

export type ProjectCreate = {
  title: string;
  description?: string;
};

export default {
  getAll: () => {
    return client<Project[]>("project/");
  },
  getById: (projectId: number) => {
    return client<Project>(`project/${projectId}/`);
  },
  createProject: (project: ProjectCreate) => {
    return client<Project>("project/", {
      method: "POST",
      body: JSON.stringify(project),
    });
  },
  delete: (projectId: number) => {
    return client(`project/${projectId}/`, {
      method: "delete",
    });
  },
};
