import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectService, { Project } from "../services/projects";
import { HiTrash } from "react-icons/hi";
import { AiOutlineSetting, AiOutlineUnorderedList } from "react-icons/ai";
import { BsCardHeading } from "react-icons/bs";
import PageHeader from "../components/page-header";

const ProjectsViewType = {
  LIST: 0,
  CARD: 1,
};

type ProjectViewProps = {
  projects: Project[];
  deleteProject: (projectId: number) => void;
  showProjectSettings: (projectId: number) => void;
};

const ProjectsListView: FC<ProjectViewProps> = ({
  projects,
  deleteProject,
  showProjectSettings,
}) => {
  return (
    <ul>
      {projects.map((project) => (
        <li
          key={project.id}
          className="flex gap-4 items-center justify-between p-4 hover:bg-gray-50 cursor-pointer rounded-md">
          <div className="w-full">
            <Link
              to={project.id.toString()}
              className="block font-bold text-gray-700 hover:text-indigo-500">
              <h3>
                {project.title} ({project.task_count})
              </h3>
            </Link>
          </div>
          <div className="w-full text-right">
            <span className="inline-block p-2 rounded-full hover:bg-red-300">
              <HiTrash
                onClick={() => deleteProject(project.id)}
                className="cursor-pointer text-red-700"
              />
            </span>
            <span className="inline-block p-2 rounded-full hover:bg-indigo-300">
              <AiOutlineSetting
                onClick={() => showProjectSettings(project.id)}
                className="cursor-pointer font-bold text-indigo-700"
              />
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

const ProjectsCardView: FC<ProjectViewProps> = ({
  projects,
  deleteProject,
  showProjectSettings,
}) => {
  return (
    <div className="p-4 flex gap-6">
      {projects.map((project, index) => (
        <div key={index}>
          <div className="w-[300px] rounded-lg shadow-lg">
            <Link to={`/projects/${project.id}`}>
              <img
                src={project.image_url ?? "images/project.jpg"}
                alt={project.title}
              />
            </Link>
            <div className="flex flex-col gap-4 items-center">
              <Link to={`/projects/${project.id}`}>
                <div className="p-4 pt-2">
                  <h3 className="text-lg font-semibold text-center text-gray-700 hover:text-indigo-500 mb-4">
                    {project.title}
                  </h3>
                  <p className="text-justify">{project.description}</p>
                </div>
              </Link>
              <div>
                <span className="inline-block p-2 rounded-full hover:bg-red-300">
                  <HiTrash
                    onClick={() => deleteProject(project.id)}
                    className="cursor-pointer text-red-700"
                  />
                </span>
                <span className="inline-block p-2 rounded-full hover:bg-indigo-300">
                  <AiOutlineSetting
                    onClick={() => showProjectSettings(project.id)}
                    className="cursor-pointer font-bold text-indigo-700"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProjectsPage = () => {
  const [view, setView] = useState<number>(ProjectsViewType.LIST);
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

  const showProjectSettings = (projectId: number): void => {
    console.log(`Show Settings for project ${projectId}`);
  };

  return (
    <div>
      <PageHeader>
        <div className="font-bold text-2xl text-gray-700 pl-4">
          Projects ({projects.length})
        </div>
        <div className="rounded-md shadow-md shadow-gray-200 bg-gray-100 flex">
          <span
            className={
              "p-1 block cursor-pointer m-1" +
              (view === ProjectsViewType.LIST
                ? " bg-white rounded-md text-gray-700"
                : "")
            }
            onClick={() => setView(ProjectsViewType.LIST)}>
            <AiOutlineUnorderedList className="h-6 w-6 text-black" />
          </span>
          <span
            className={
              "p-1 block cursor-pointer m-1" +
              (view === ProjectsViewType.CARD
                ? " bg-white rounded-md text-gray-700"
                : "")
            }
            onClick={() => setView(ProjectsViewType.CARD)}>
            <BsCardHeading className="h-6 w-6 text-black" />
          </span>
        </div>
      </PageHeader>
      <section>
        {error ? (
          <div>No projects found</div>
        ) : view == ProjectsViewType.LIST ? (
          <ProjectsListView
            projects={projects}
            deleteProject={deleteProject}
            showProjectSettings={showProjectSettings}
          />
        ) : (
          <ProjectsCardView
            projects={projects}
            deleteProject={deleteProject}
            showProjectSettings={showProjectSettings}
          />
        )}
      </section>
    </div>
  );
};

export default ProjectsPage;
