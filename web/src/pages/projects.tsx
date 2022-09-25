import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectService, { Project } from "../services/projects";
import { HiTrash } from "react-icons/hi";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ProjectService.getAll()
      .then((data) => setProjects(data))
      .catch((e) => setError(e));
  }, []);

  const deleteProject = (projectId: number) => {
    ProjectService.delete(projectId).then(() => {
      setProjects((prevData) =>
        prevData.filter((project) => project.id !== projectId)
      );
    });
  };

  return (
    <div>
      <ul>
        {error ? (
          <div>No projects found</div>
        ) : (
          projects.map((project) => (
            <li key={project.id} className="flex gap-4 items-center">
              <Link to={project.id.toString()}>{project.title}</Link>
              <HiTrash
                onClick={() => deleteProject(project.id)}
                className="cursor-pointer"
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ProjectsPage;
