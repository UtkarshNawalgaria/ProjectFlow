import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { TaskListCreate } from "../../services/tasks";
import Modal from "../modal";

const NewTaskListModal = ({
  open,
  closeModal,
  onFormSubmit,
}: {
  open: boolean;
  closeModal: () => void;
  onFormSubmit: (list: TaskListCreate) => void;
}) => {
  const { projectId } = useParams();
  const [list, setList] = useState<TaskListCreate>({
    title: "",
    project: parseInt(projectId as string),
  });

  const handleFormSubmission = (e: FormEvent) => {
    e.preventDefault();
    onFormSubmit(list);
    closeModal();
  };

  const reset = () => {
    setList({
      title: "",
      project: parseInt(projectId as string),
    });
    closeModal();
  };

  return (
    <Modal title="Create Task List" closeModal={reset} open={open}>
      <form onSubmit={handleFormSubmission}>
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
            required
            value={list.title}
            onChange={(e) =>
              setList((prevData) => {
                return { ...prevData, title: e.target.value };
              })
            }
            className="rounded-md border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full"
          />
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
            Create Task List
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewTaskListModal;
