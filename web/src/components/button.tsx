type ButtonProps = {
  text: string;
  type: "CANCEL" | "CONFIRM" | "DANGER";
  icon: JSX.Element;
  onClick: () => void;
};

const Button = ({ text, type, icon, onClick }: ButtonProps) => {
  const typetoColor = {
    CONFIRM: "bg-primary text-white",
    CANCEL: "text-primary",
    DANGER: "bg-error text-white",
  };

  const btnStyleWithIcon = "flex items-center gap-2";

  return (
    <button
      onClick={onClick}
      className={`rounded-md font-semibold cursor-pointer py-2 px-6 outline outline-1 hover:bg-indigo-600 transition ${
        typetoColor[type]
      } ${icon ? btnStyleWithIcon : null}`}>
      <span>{text}</span>
      {icon ? <span>{icon}</span> : null}
    </button>
  );
};

export default Button;
