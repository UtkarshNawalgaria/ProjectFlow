import { Dialog } from "@headlessui/react";
import { HiX } from "react-icons/hi";

export type ModalProps = {
  title: string;
  children: JSX.Element[] | JSX.Element;
  open: boolean;
  closeModal: () => void;
};

const Modal = ({ title, children, open, closeModal }: ModalProps) => {
  return (
    <Dialog className="relative z-50" onClose={closeModal} open={open}>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="mx-auto w-[600px] bg-white text-black p-0 rounded-md">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <Dialog.Title className="text-xl font-medium text-gray-800">
              {title}
            </Dialog.Title>
            <span className="mt-1 cursor-pointer" onClick={closeModal}>
              <HiX className="text-gray-500" />
            </span>
          </div>
          <div className="p-6">{children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;
