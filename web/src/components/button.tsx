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
    CONFIRM:
      "dark:bg-slate-900 dark:text-grey-lightest bg-primary text-white dark:text-grey-lightest hover:bg-indigo-600",
    CANCEL: "text-primary",
    DANGER: "bg-error text-white",
  };
  const btnStyleWithIcon = "flex items-center gap-2";
  const buttonProps = {
    onClick: as === "button" ? onClick : undefined,
    className: `rounded-md font-medium text-sm cursor-pointer py-2 px-2 border border-2 border-slate-700 transition ${
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
