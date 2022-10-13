type ButtonProps = {
  text: string;
  type: "CANCEL" | "CONFIRM" | "DANGER";
  icon?: JSX.Element;
  onClick?: () => void;
  extraStyles?: string;
};

const Button = ({ text, type, icon, onClick, extraStyles }: ButtonProps) => {
  const typetoColor = {
    CONFIRM: "bg-primary text-white hover:bg-indigo-600",
    CANCEL: "text-primary",
    DANGER: "bg-error text-white",
  };

  const btnStyleWithIcon = "flex items-center gap-2";

  return (
    <button
      onClick={onClick}
      className={`rounded-md font-semibold cursor-pointer py-2 px-6 outline outline-1 transition ${
        typetoColor[type]
      } ${icon ? btnStyleWithIcon : null} ${extraStyles}`}>
      <span>{text}</span>
      {icon ? <span>{icon}</span> : null}
    </button>
  );
};

export default Button;
