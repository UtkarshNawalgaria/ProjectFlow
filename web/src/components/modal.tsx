export type ModalProps = {
  headerText: string;
  body: JSX.Element;
  footer?: JSX.Element;
  buttons?: JSX.Element[];
  toggleModal: boolean;
  modalId: string;
};

const Modal = ({ body, toggleModal, modalId, headerText }: ModalProps) => {
  return (
    <div>
      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className={"modal" + (toggleModal ? " modal-open" : "")}>
        <div className="modal-box relative bg-white text-black">
          <h3 className="text-xl font-bold mb-5">{headerText}</h3>
          <div>{body}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
