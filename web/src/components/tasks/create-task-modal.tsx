import { ChangeEvent, useState, FormEvent } from "react";
import { useParams } from "react-router-dom";
import useTasks, { TasksProviderType } from "../../context/TasksProvider";
import useUser, { TUserContext } from "../../context/UserProvider";
import { TaskCreate, emptyTask, PriorityOptions } from "../../services/tasks";
import { capitalize, ProcessedFormErrorType } from "../../utils";
import Modal from "../modal";

const NewTaskModal = ({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) => {
  const { projectId } = useParams();
  const { user } = useUser() as TUserContext;
  const { lists, addNewTask } = useTasks() as TasksProviderType;
  const [error, setError] = useState<ProcessedFormErrorType | null>(null);
  const [newTask, setNewTask] = useState<TaskCreate>({
    ...emptyTask,
    project: parseInt(projectId as string),
  });

  const setNewTaskFormData = (
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | ChangeEvent<HTMLSelectElement>
  ) => {
    setNewTask((prevData) => {
      return { ...prevData, [event.target.name]: event.target.value };
    });
  };

  const reset = () => {
    setError(null);
    setNewTask({
      ...emptyTask,
      project: parseInt(projectId as string),
    });
    closeModal();
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    addNewTask({ ...newTask, owner: user?.id as number });
    reset();
  };

  return (
    <Modal title="Add new task" open={open} closeModal={closeModal}>
      <form onSubmit={handleFormSubmit} className="w-full">
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
            value={newTask?.title}
            onChange={(e) => setNewTaskFormData(e)}
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
            value={newTask.description}
            onChange={(e) => setNewTaskFormData(e)}
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
        <div className="mb-4">
          <label className="block text-md font-medium text-grey-dark mb-1">
            Choose List
          </label>
          <select
            onChange={(e) => setNewTaskFormData(e)}
            className="rounded-md border focus: border-primary focus:ring-1 focus:ring-primary w-1/2"
            name="tasklist"
            defaultValue={undefined}>
            <option value="0">Todo</option>
            {lists.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-md font-medium text-grey-dark mb-1">
            Priority
          </label>
          <select
            onChange={(e) => setNewTaskFormData(e)}
            className="rounded-md border focus: border-primary focus:ring-1 focus:ring-primary w-1/2"
            name="tasklist"
            defaultValue={undefined}>
            {Object.keys(PriorityOptions).map((priority) => (
              <option key={priority} value={priority}>
                {capitalize(priority)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4 mt-10">
          <button
            className="w-1/2 outline outline-1 rounded-md font-semibold text-primary cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              reset();
            }}>
            Cancel
          </button>
          <button className="text-center bg-primary py-3 rounded-md font-semibold text-white cursor-pointer w-1/2">
            Create Task
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewTaskModal;
