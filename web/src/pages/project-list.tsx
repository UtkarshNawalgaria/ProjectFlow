import { ChangeEvent, FormEvent, FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectService, { Project, ProjectCreate } from "../services/projects";
import { HiFolderAdd, HiPlus, HiTrash } from "react-icons/hi";
import { AiOutlineSetting, AiOutlineUnorderedList } from "react-icons/ai";
import { BsCardHeading } from "react-icons/bs";
import PageHeader from "../components/page-header";
import Modal from "../components/modal";
import { ProcessedFormErrorType } from "../utils";
import { toast } from "react-toastify";

const ProjectsViewType = {
  LIST: 0,
  CARD: 1,
};

type ProjectViewProps = {
  projects: Project[];
  deleteProject: (projectId: number) => void;
  showProjectSettings?: (projectId: number) => void;
  openModal: () => void;
};

const ProjectsListView: FC<ProjectViewProps> = ({
  projects,
  deleteProject,
  openModal,
}) => {
  return (
    <>
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            className="flex gap-4 items-center justify-between p-4 mb-4 bg-grey-lightest cursor-pointer rounded-md hover:bg-gray-100">
            <div className="w-full">
              <Link
                to={project.id.toString()}
                className="block font-bold text-grey-dark hover:text-primary">
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
                <AiOutlineSetting className="cursor-pointer font-bold text-indigo-700" />
              </span>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="w-full p-4 mt-8 bg-gray-100 outline-dashed outline-gray-300 outline-2 text-gray-800 cursor-pointer rounded-md flex items-center justify-center gap-2 hover:text-gray-600 hover:bg-grey-lightest hover:outline-gray-200 hover:outline-dashed"
        onClick={openModal}>
        <span>Create Project</span>
        <span>
          <HiPlus />
        </span>
      </button>
    </>
  );
};

const ProjectsCardView: FC<ProjectViewProps> = ({
  projects,
  deleteProject,
  openModal,
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
                  <h3 className="text-lg font-semibold text-center text-grey-dark hover:text-primary mb-4">
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
                  <AiOutlineSetting className="cursor-pointer font-bold text-indigo-700" />
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div
        className="w-[300px] h-[500px] rounded-lg bg-gray-100 outline-dashed outline-gray-300 outline-2 cursor-pointer hover:bg-grey-lightest hover:outline-gray-400"
        onClick={openModal}>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <span>
            <HiFolderAdd className="h-14 w-14 text-gray-500" />
          </span>
          <span className="text-gray-500">Create Project</span>
        </div>
      </div>
    </div>
  );
};

const ProjectsPage = () => {
  const [view, setView] = useState<number>(ProjectsViewType.LIST);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<ProjectCreate>({
    title: "",
    description: "",
  });
  const [error, setError] = useState<ProcessedFormErrorType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    ProjectService.getAll().then((data) => setProjects(data));
  }, []);

  const deleteProject = (projectId: number) => {
    const project = projects.find((p) => p.id === projectId);

    if (project?.task_count && project?.task_count > 0) {
      return;
    }

    ProjectService.delete(projectId).then(() => {
      setProjects((prevData) =>
        prevData.filter((project) => project.id !== projectId)
      );
      toast.success("Project Deleted Successfuly", {
        position: toast.POSITION.TOP_RIGHT,
      });
    });
  };

  const setNewProjectFormData = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewProject((prevData) => {
      return { ...prevData, [event.target.name]: event.target.value };
    });
  };

  const createNewProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    ProjectService.createProject(newProject)
      .then((newProject) => {
        setProjects((prevProjects) => [...prevProjects, newProject]);
        setModalOpen(false);
        setNewProject({ title: "", description: "" });
        toast.success("Project Created Successfuly", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((e) => {
        setError(e);
      });
  };

  return (
    <div>
      <PageHeader>
        <div className="font-bold text-2xl text-grey-dark pl-4">
          Projects ({projects.length})
        </div>
        <div className="rounded-md shadow-md shadow-gray-200 bg-gray-100 flex">
          <span
            className={
              "p-1 block cursor-pointer m-1" +
              (view === ProjectsViewType.LIST
                ? " bg-white rounded-md text-grey-dark"
                : "")
            }
            onClick={() => setView(ProjectsViewType.LIST)}>
            <AiOutlineUnorderedList className="h-6 w-6 text-black" />
          </span>
          <span
            className={
              "p-1 block cursor-pointer m-1" +
              (view === ProjectsViewType.CARD
                ? " bg-white rounded-md text-grey-dark"
                : "")
            }
            onClick={() => setView(ProjectsViewType.CARD)}>
            <BsCardHeading className="h-6 w-6 text-black" />
          </span>
        </div>
      </PageHeader>
      <section>
        {projects.length === 0 ? (
          <div>No projects found</div>
        ) : view == ProjectsViewType.LIST ? (
          <div>
            <ProjectsListView
              projects={projects}
              deleteProject={deleteProject}
              openModal={() => setModalOpen(true)}
            />
          </div>
        ) : (
          <ProjectsCardView
            projects={projects}
            deleteProject={deleteProject}
            openModal={() => setModalOpen(true)}
          />
        )}
      </section>
      <Modal
        toggleModal={modalOpen}
        modalId="create-new-project-modal"
        headerText="Create New Project"
        body={
          <form className="w-full" onSubmit={createNewProject}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-md font-medium text-grey-dark mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newProject.title}
                onChange={(e) => setNewProjectFormData(e)}
                className={
                  "rounded-md border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full" +
                  (error !== null && error.title
                    ? " border-error"
                    : " border-gray-300")
                }
              />
              {error !== null && error.title ? (
                <span className="text-sm text-error">{error.title}</span>
              ) : null}
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-md font-medium text-grey-dark mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={newProject.description}
                onChange={(e) => setNewProjectFormData(e)}
                className={
                  "rounded-md border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full" +
                  (error !== null && error.description
                    ? " border-error"
                    : " border-gray-300")
                }
              />
              {error !== null && error.description ? (
                <span className="text-sm text-error">{error.description}</span>
              ) : null}
            </div>
            <div className="flex gap-4">
              <button
                className="w-1/2 bg-gray-500 rounded-md font-semibold text-white cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setError(null);
                  setNewProject({ title: "", description: "" });
                  setModalOpen(false);
                }}>
                Cancel
              </button>
              <input
                type="submit"
                value="Create Project"
                className="text-center bg-primary py-3 rounded-md font-semibold text-white cursor-pointer w-1/2"
              />
            </div>
          </form>
        }
      />
    </div>
  );
};

export default ProjectsPage;
