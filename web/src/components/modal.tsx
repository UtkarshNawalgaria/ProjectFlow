export type ModalProps = {
  headerText: string;
  body: JSX.Element;
  footer?: JSX.Element;
  buttons?: JSX.Element[];
  toggleModal: boolean;
  modalId: string;
};

const Modal: React.FC<ModalProps> = ({
  body,
  toggleModal,
  modalId,
  headerText,
}) => {
  return (
    <div>
      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className={"modal" + (toggleModal ? " modal-open" : "")}>
        <div className="modal-box relative bg-white text-black">
          <h3 className="text-xl font-bold mb-10">{headerText}</h3>
          <div>{body}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
