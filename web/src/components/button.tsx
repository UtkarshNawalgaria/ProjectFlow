type ButtonProps = {
  as: "button" | "input";
  text: string;
  type: "CANCEL" | "CONFIRM" | "DANGER";
  icon?: JSX.Element;
  onClick?: () => void;
  extraStyles?: string;
};

const Button = ({
  as,
  text,
  type,
  icon,
  onClick,
  extraStyles,
}: ButtonProps) => {
  const typetoColor = {
    CONFIRM: "bg-primary text-white hover:bg-indigo-600",
    CANCEL: "text-primary",
    DANGER: "bg-error text-white",
  };
  const btnStyleWithIcon = "flex items-center gap-2";
  const buttonProps = {
    onClick: as === "button" ? onClick : undefined,
    className: `rounded-md font-semibold cursor-pointer py-2 px-6 outline outline-1 transition ${
      typetoColor[type]
    } ${icon ? btnStyleWithIcon : ""} ${extraStyles ? extraStyles : ""}`,
  };

  if (as === "button") {
    return (
      <button {...buttonProps}>
        <span>{text}</span>
        {icon ? <span>{icon}</span> : null}
      </button>
    );
  }

  return <input type="submit" value={text} {...buttonProps} />;
};

export default Button;
