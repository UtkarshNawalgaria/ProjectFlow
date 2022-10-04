type ButtonProps = {
  text: string;
  type: "CANCEL" | "CONFIRM" | "DANGER";
  onClick?: () => void;
};

const Button = ({ text, type, onClick }: ButtonProps) => {
  const typetoColor = {
    CONFIRM: "bg-primary text-white",
    CANCEL: "text-primary",
    DANGER: "bg-error text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-md font-semibold cursor-pointer py-2 px-6 outline outline-1 ${typetoColor[type]}`}>
      {text}
    </button>
  );
};

export default Button;
