import { ChangeEvent, FormEvent, FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsCardHeading } from "react-icons/bs";
import { HiFolderAdd, HiPlus, HiTrash } from "react-icons/hi";
import { AiOutlineSetting, AiOutlineUnorderedList } from "react-icons/ai";
import { toast } from "react-toastify";

import Modal from "../../components/modals/modal";
import Button from "../../components/button";
import PageHeader from "../../components/page-header";

import ProjectService, { Project } from "../../services/projects";
import { ProcessedFormErrorType } from "../../utils";
import useUser, { TUserContext } from "../../context/UserProvider";
import { TAuthenticatedUser } from "../../services/users";

const ProjectsViewType = {
  LIST: 0,
  CARD: 1,
};

type ProjectViewProps = {
  projects: Project[];
  user: TAuthenticatedUser | null;
  setSelectedProjectId: React.Dispatch<number>;
  deleteProject: (projectId: number, confirmDelete?: boolean) => void;
  showProjectSettings?: (projectId: number) => void;
  openModal: () => void;
};

const ProjectsListView: FC<ProjectViewProps> = ({
  projects,
  deleteProject,
  setSelectedProjectId,
}) => {
  return (
    <>
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            className={`flex gap-4 items-center justify-between px-4 py-2 mb-4 rounded-md bg-grey-lightest dark:bg-slate-800 cursor-pointer hover:bg-gray-100`}>
            <div className="w-full">
              <Link
                to={project.id.toString()}
                className="block font-medium text-grey-dark dark:text-grey-lightest hover:text-primary">
                <h3>
                  {project.title} ({project.task_count})
                </h3>
              </Link>
            </div>
            <div className="w-full flex items-center justify-end">
              <span className="inline-block p-2 rounded-full hover:bg-red-300">
                <HiTrash
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    deleteProject(project.id);
                  }}
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
    </>
  );
};

const ProjectsCardView: FC<ProjectViewProps> = ({
  projects,
  deleteProject,
  openModal,
  setSelectedProjectId,
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
                  <h3 className="text-lg font-semibold text-center text-grey-dark dark:text-grey-lightest hover:text-primary mb-4">
                    {project.title}
                  </h3>
                  <p className="text-justify dark:text-grey-lightest">
                    {project.description}
                  </p>
                </div>
              </Link>
              <div>
                <span className="inline-block p-2 rounded-full hover:bg-red-300">
                  <HiTrash
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      deleteProject(project.id);
                    }}
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
  const { currentOrganization, user } = useUser() as TUserContext;
  const [view, setView] = useState(ProjectsViewType.LIST);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
  });
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [error, setError] = useState<ProcessedFormErrorType | null>(null);
  const [showNewProjectModal, toggleNewProjectModal] = useState(false);
  const [showDeleteConfirmModal, toggleDeleteConfirmModal] = useState(false);

  useEffect(() => {
    if (currentOrganization?.id) {
      ProjectService.getAll(currentOrganization.id).then((data) =>
        setProjects(data)
      );
    }
  }, [currentOrganization?.id]);

  const deleteProject = (projectId: number, confirmDelete = false) => {
    if (!confirmDelete) {
      toggleDeleteConfirmModal(true);
      return;
    }

    ProjectService.delete(projectId).then(() => {
      setProjects((prevData) =>
        prevData.filter((project) => project.id !== projectId)
      );
      toast.success("Project Deleted Successfuly", {
        position: toast.POSITION.TOP_RIGHT,
      });
      toggleDeleteConfirmModal(false);
    });

    setProjects((projects) =>
      projects.filter((project) => project.id !== selectedProjectId)
    );
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

    if (!currentOrganization?.id || !user?.id) return;

    ProjectService.createProject({
      ...newProject,
      organization: currentOrganization.id,
      owner: user.id,
    })
      .then((newProject) => {
        setProjects((prevProjects) => [...prevProjects, newProject]);
        toggleNewProjectModal(false);
        setError(null);
        setNewProject({
          title: "",
          description: "",
        });
        toast.success("Project Created Successfuly", {
          position: toast.POSITION.TOP_RIGHT,
        });
      })
      .catch((e) => {
        setError(e);
      });
  };

  const resetData = () => {
    setSelectedProjectId(null);
    toggleDeleteConfirmModal(false);
  };

  return (
    <div>
      <PageHeader>
        <div className="font-bold text-lg text-grey-dark dark:text-grey-lightest">
          Projects ({projects.length})
        </div>
        <div className="flex items-center gap-8" id="toolbar">
          <div>
            <Button
              as="button"
              text="Create Project"
              type="CONFIRM"
              onClick={() => toggleNewProjectModal(true)}
              icon={<HiPlus className="font-medium text-md" />}
            />
          </div>
          <div className="rounded-sm shadow-md shadow-gray-200 dark:shadow-none bg-gray-100 dark:bg-slate-900 dark:border dark:border-slate-700 flex">
            <span
              className={
                "p-1 block cursor-pointer m-1" +
                (view === ProjectsViewType.LIST
                  ? " bg-white dark:bg-slate-800 rounded-md text-grey-dark"
                  : "")
              }
              onClick={() => setView(ProjectsViewType.LIST)}>
              <AiOutlineUnorderedList className="h-6 w-6 text-black dark:text-grey-lightest" />
            </span>
            <span
              className={
                "p-1 block cursor-pointer m-1" +
                (view === ProjectsViewType.CARD
                  ? " bg-white dark:bg-slate-800 rounded-md text-grey-dark"
                  : "")
              }
              onClick={() => setView(ProjectsViewType.CARD)}>
              <BsCardHeading className="h-6 w-6 text-black dark:text-grey-lightest" />
            </span>
          </div>
        </div>
      </PageHeader>
      <section className="px-4">
        {projects.length === 0 ? (
          <div>No projects found</div>
        ) : view == ProjectsViewType.LIST ? (
          <div>
            <ProjectsListView
              user={user}
              projects={projects}
              deleteProject={deleteProject}
              openModal={() => toggleNewProjectModal(true)}
              setSelectedProjectId={setSelectedProjectId}
            />
          </div>
        ) : (
          <ProjectsCardView
            user={user}
            projects={projects}
            deleteProject={deleteProject}
            openModal={() => () => toggleNewProjectModal(true)}
            setSelectedProjectId={setSelectedProjectId}
          />
        )}
      </section>
      <div className="page-modals">
        <Modal
          title="Create New Project"
          open={showNewProjectModal}
          closeModal={() => {
            setError(null);
            setNewProject({
              title: "",
              description: "",
            });
            toggleNewProjectModal(false);
          }}>
          <form className="w-full" onSubmit={createNewProject}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-md font-medium text-grey-dark dark:text-grey-lightest mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newProject.title}
                onChange={(e) => setNewProjectFormData(e)}
                className={
                  "rounded-md border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full dark:text-grey-lightest dark:bg-slate-800" +
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
                className="block text-md font-medium text-grey-dark dark:text-grey-lightest mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={newProject.description}
                onChange={(e) => setNewProjectFormData(e)}
                className={
                  "rounded-md border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full dark:text-grey-lightest dark:bg-slate-800" +
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
                className="w-1/2 outline outline-1 rounded-md font-semibold text-primary cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setError(null);
                  setNewProject({
                    title: "",
                    description: "",
                  });
                  toggleNewProjectModal(false);
                }}>
                Cancel
              </button>
              <button className="text-center bg-primary py-3 rounded-md font-semibold text-white cursor-pointer w-1/2">
                Create Project
              </button>
            </div>
          </form>
        </Modal>
        <Modal
          title="Delete Project ?"
          open={showDeleteConfirmModal}
          closeModal={() => toggleDeleteConfirmModal(false)}>
          <p>
            This Project has tasks associated with it. Confirm if you want to
            delete the project along with the tasks.
          </p>
          <div className="mt-5 flex gap-4">
            <Button
              as="button"
              text="Cancel"
              onClick={resetData}
              type={"CANCEL"}
            />
            <Button
              as="button"
              text="Delete"
              onClick={() => {
                deleteProject(selectedProjectId as number, true);
                toggleDeleteConfirmModal(false);
              }}
              type={"DANGER"}
            />
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default ProjectsPage;
