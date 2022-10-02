type ButtonProps = {
  text: string;
  type: "CANCEL" | "CONFIRM" | "DANGER";
  onButtonClick?: () => void;
};

const Button = ({ text, type, onButtonClick }: ButtonProps) => {
  const typetoColor = {
    CONFIRM: "bg-primary",
    CANCEL: "bg-gray-500",
    DANGER: "bg-error",
  };

  return (
    <button
      onClick={onButtonClick}
      className={`${typetoColor[type]} rounded-md font-semibold text-white cursor-pointer py-2 px-6`}>
      {text}
    </button>
  );
};

export default Button;
