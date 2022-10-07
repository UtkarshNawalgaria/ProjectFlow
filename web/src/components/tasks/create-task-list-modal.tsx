import { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import { HiX } from "react-icons/hi";
import { TaskList, TaskListCreate } from "../../services/tasks";

const NewTaskListModal = ({
  modalId,
  toggleModal,
  onFormSubmit,
}: {
  modalId: string;
  toggleModal: any;
  onFormSubmit: (list: TaskListCreate) => void;
}) => {
  const { projectId } = useParams();
  const [list, setList] = useState<TaskListCreate>({
    title: "",
    project_id: parseInt(projectId as string),
  });

  const handleFormSubmission = (e: FormEvent) => {
    e.preventDefault();
    onFormSubmit(list);
    toggleModal(false);
  };

  return (
    <>
      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className="modal modal-open">
        <div className="modal-box relative bg-white text-black p-0">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-xl font-medium text-gray-800">
              Create Task List
            </h3>
            <span
              className="mt-1 cursor-pointer"
              onClick={() => toggleModal(false)}>
              <HiX className="text-gray-500" />
            </span>
          </div>
          <div className="p-6">
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
                    setList({
                      title: "",
                      project_id: parseInt(projectId as string),
                    });
                    toggleModal(false);
                  }}>
                  Cancel
                </button>
                <button className="text-center bg-primary py-3 rounded-md font-semibold text-white cursor-pointer w-1/2">
                  Create Task List
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewTaskListModal;
