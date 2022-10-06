import { HiX } from "react-icons/hi";

export type ModalProps = {
  headerText: string;
  body: JSX.Element;
  footer?: JSX.Element;
  buttons?: JSX.Element[];
  toggleModal: boolean;
  modalId: string;
  closeModal?: () => void;
};

const Modal = ({
  body,
  toggleModal,
  closeModal,
  modalId,
  headerText,
}: ModalProps) => {
  return (
    <div>
      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className={"modal" + (toggleModal ? " modal-open" : "")}>
        <div className="modal-box relative bg-white text-black p-0">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-xl font-medium text-gray-800">{headerText}</h3>
            <span className="mt-1 cursor-pointer" onClick={closeModal}>
              <HiX className="text-gray-500" />
            </span>
          </div>
          <div className="p-6">{body}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
